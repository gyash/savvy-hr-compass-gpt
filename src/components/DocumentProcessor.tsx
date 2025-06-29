
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Brain, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ProcessedDocument {
  id: string;
  filename: string;
  category: string;
  insights: string[];
  confidence: number;
  keyPoints: string[];
  recommendations: string[];
}

const DocumentProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedDocs, setProcessedDocs] = useState<ProcessedDocument[]>([]);
  const [progress, setProgress] = useState(0);

  const processDocument = async (file: File): Promise<ProcessedDocument> => {
    // Simulate document processing with AI
    const text = await file.text();
    
    // Send to our AI function for processing
    const { data, error } = await supabase.functions.invoke('process-document', {
      body: {
        filename: file.name,
        content: text,
        fileType: file.type
      }
    });

    if (error) throw error;

    return {
      id: Date.now().toString(),
      filename: file.name,
      category: data.category || 'general',
      insights: data.insights || [],
      confidence: data.confidence || 85,
      keyPoints: data.keyPoints || [],
      recommendations: data.recommendations || []
    };
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const results: ProcessedDocument[] = [];
      
      for (let i = 0; i < acceptedFiles.length; i++) {
        setProgress((i / acceptedFiles.length) * 100);
        
        try {
          const result = await processDocument(acceptedFiles[i]);
          results.push(result);
          
          // Add to knowledge base automatically
          await supabase.from('knowledge_base').insert({
            title: `Processed: ${result.filename}`,
            content: result.keyPoints.join('\n\n'),
            category: result.category,
            content_type: 'document',
            tags: [result.category, 'auto-processed']
          });
          
        } catch (error) {
          console.error(`Error processing ${acceptedFiles[i].name}:`, error);
          toast.error(`Failed to process ${acceptedFiles[i].name}`);
        }
      }
      
      setProcessedDocs(prev => [...prev, ...results]);
      setProgress(100);
      
      toast.success(`Successfully processed ${results.length} document(s)`);
      
    } catch (error) {
      console.error('Error processing documents:', error);
      toast.error('Failed to process documents');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 2000);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/csv': ['.csv']
    },
    multiple: true
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'employment_law': 'bg-red-100 text-red-800',
      'policy': 'bg-blue-100 text-blue-800',
      'recruitment': 'bg-green-100 text-green-800',
      'training': 'bg-purple-100 text-purple-800',
      'compliance': 'bg-orange-100 text-orange-800',
      'benefits': 'bg-pink-100 text-pink-800',
      'general': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.general;
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <Card className="border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-orange-800">
            <Brain className="h-6 w-6" />
            Smart Document Processor
          </CardTitle>
          <CardDescription className="text-lg text-orange-600">
            Upload HR documents and let AI automatically categorize and extract insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive 
                ? 'border-orange-400 bg-orange-100/50' 
                : 'border-orange-300 hover:border-orange-400 hover:bg-orange-50/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full flex items-center justify-center mx-auto">
                <Upload className="h-8 w-8 text-orange-600" />
              </div>
              {isDragActive ? (
                <p className="text-xl text-orange-700 font-medium">Drop your documents here...</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-xl text-orange-700 font-medium">
                    Drag & drop documents or click to browse
                  </p>
                  <p className="text-orange-600">
                    Supports PDF, DOC, DOCX, TXT, CSV files
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {isProcessing && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm text-orange-700">
                <span>Processing documents...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Documents */}
      {processedDocs.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Processed Documents
          </h3>
          
          <div className="grid gap-6">
            {processedDocs.map((doc) => (
              <Card key={doc.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <FileText className="h-5 w-5 text-orange-600" />
                        {doc.filename}
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <Badge className={getCategoryColor(doc.category)}>
                          {doc.category.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <Zap className="h-4 w-4" />
                          {doc.confidence}% confidence
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                  {doc.keyPoints.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                        Key Points
                      </h4>
                      <ul className="space-y-2">
                        {doc.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {doc.insights.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-500" />
                        AI Insights
                      </h4>
                      <ul className="space-y-2">
                        {doc.insights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {doc.recommendations.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {doc.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentProcessor;
