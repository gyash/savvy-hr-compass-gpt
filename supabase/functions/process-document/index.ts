
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { filename, content, fileType } = await req.json();

    console.log(`Processing document: ${filename}`);

    // Analyze content to determine category and extract insights
    const analysisPrompt = `Analyze this HR document and provide:
1. Category (employment_law, policy, recruitment, training, compliance, benefits, or general)
2. Key points (3-5 main points)
3. Insights (2-3 AI-generated insights)
4. Recommendations (2-3 actionable recommendations)
5. Confidence score (0-100)

Document: ${filename}
Content: ${content.substring(0, 3000)}`;

    // Use OpenAI for document analysis
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Analyzing document with OpenAI...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert HR document analyzer. Analyze documents and provide structured insights in JSON format.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const analysisResult = aiResponse.choices[0].message.content;

    // Parse AI response or provide fallback
    let processedData;
    try {
      processedData = JSON.parse(analysisResult);
    } catch (e) {
      // Fallback analysis based on content keywords
      processedData = analyzeDocumentFallback(filename, content);
    }

    // Ensure required fields exist
    const result = {
      category: processedData.category || categorizeDocument(filename, content),
      keyPoints: processedData.keyPoints || processedData.key_points || extractKeyPoints(content),
      insights: processedData.insights || generateInsights(content),
      recommendations: processedData.recommendations || generateRecommendations(content),
      confidence: processedData.confidence || 75
    };

    console.log(`Document processed successfully: ${JSON.stringify(result)}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-document function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function categorizeDocument(filename: string, content: string): string {
  const lower = (filename + ' ' + content).toLowerCase();
  
  if (lower.includes('employment') || lower.includes('labor') || lower.includes('law')) return 'employment_law';
  if (lower.includes('policy') || lower.includes('procedure') || lower.includes('handbook')) return 'policy';
  if (lower.includes('recruit') || lower.includes('hiring') || lower.includes('interview')) return 'recruitment';
  if (lower.includes('training') || lower.includes('development') || lower.includes('learning')) return 'training';
  if (lower.includes('compliance') || lower.includes('audit') || lower.includes('regulation')) return 'compliance';
  if (lower.includes('benefit') || lower.includes('compensation') || lower.includes('salary')) return 'benefits';
  
  return 'general';
}

function extractKeyPoints(content: string): string[] {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 5).map(s => s.trim());
}

function generateInsights(content: string): string[] {
  const insights = [
    'Document appears to contain important HR policy information',
    'May require regular review and updates based on changing regulations',
    'Could benefit from employee acknowledgment tracking'
  ];
  
  if (content.toLowerCase().includes('remote')) {
    insights.push('Remote work policies detected - ensure compliance with local laws');
  }
  
  if (content.toLowerCase().includes('termination')) {
    insights.push('Termination procedures identified - verify alignment with employment laws');
  }
  
  return insights.slice(0, 3);
}

function generateRecommendations(content: string): string[] {
  return [
    'Consider adding this to your knowledge base for team reference',
    'Schedule periodic review to ensure continued compliance',
    'Share with relevant stakeholders for feedback and implementation'
  ];
}

function analyzeDocumentFallback(filename: string, content: string) {
  return {
    category: categorizeDocument(filename, content),
    keyPoints: extractKeyPoints(content),
    insights: generateInsights(content),
    recommendations: generateRecommendations(content),
    confidence: 65
  };
}
