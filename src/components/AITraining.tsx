
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Upload, Zap, CheckCircle, AlertCircle, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TrainingData {
  input: string;
  output: string;
  category: string;
}

const AITraining = () => {
  const [sessionName, setSessionName] = useState('');
  const [provider, setProvider] = useState('openai');
  const [trainingData, setTrainingData] = useState<TrainingData[]>([
    { input: '', output: '', category: 'general' }
  ]);
  const [isTraining, setIsTraining] = useState(false);

  const categories = [
    'general',
    'employment_law',
    'recruitment',
    'performance_management',
    'employee_relations',
    'compliance',
    'benefits',
    'culture'
  ];

  const addTrainingExample = () => {
    setTrainingData([...trainingData, { input: '', output: '', category: 'general' }]);
  };

  const removeTrainingExample = (index: number) => {
    if (trainingData.length > 1) {
      setTrainingData(trainingData.filter((_, i) => i !== index));
    }
  };

  const updateTrainingData = (index: number, field: keyof TrainingData, value: string) => {
    const updated = [...trainingData];
    updated[index][field] = value;
    setTrainingData(updated);
  };

  const handleTraining = async () => {
    if (!sessionName.trim()) {
      toast.error('Please provide a session name');
      return;
    }

    const validData = trainingData.filter(item => 
      item.input.trim() && item.output.trim()
    );

    if (validData.length === 0) {
      toast.error('Please provide at least one complete training example');
      return;
    }

    setIsTraining(true);
    try {
      const { data, error } = await supabase.functions.invoke('train-model', {
        body: {
          sessionName,
          trainingData: validData,
          provider
        }
      });

      if (error) throw error;

      toast.success(`Training completed! Processed ${data.processedCount} examples`);
      
      // Reset form
      setSessionName('');
      setTrainingData([{ input: '', output: '', category: 'general' }]);
      
    } catch (error) {
      console.error('Training error:', error);
      toast.error('Training failed. Please try again.');
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">AI Model Training</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Train the AI model with your organization's specific HR knowledge and scenarios 
          to get more personalized and accurate responses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Training Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Session Name</label>
              <Input
                placeholder="e.g., Company Policy Training"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">AI Provider</label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI GPT</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Training Examples
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {trainingData.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline">Example {index + 1}</Badge>
                {trainingData.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTrainingExample(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select 
                    value={item.category}
                    onValueChange={(value) => updateTrainingData(index, 'category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.replace('_', ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Question/Input</label>
                  <Textarea
                    placeholder="Enter the question or scenario..."
                    value={item.input}
                    onChange={(e) => updateTrainingData(index, 'input', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Expected Response/Output</label>
                  <Textarea
                    placeholder="Enter the ideal response..."
                    value={item.output}
                    onChange={(e) => updateTrainingData(index, 'output', e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={addTrainingExample}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Example
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={handleTraining}
          disabled={isTraining}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isTraining ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Training Model...
            </>
          ) : (
            <>
              <Brain className="h-5 w-5 mr-2" />
              Start Training
            </>
          )}
        </Button>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Training Tips:</p>
              <ul className="text-blue-800 space-y-1">
                <li>• Provide diverse examples covering different scenarios</li>
                <li>• Use clear, specific questions and comprehensive answers</li>
                <li>• Include edge cases and common variations</li>
                <li>• Keep responses professional and actionable</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AITraining;
