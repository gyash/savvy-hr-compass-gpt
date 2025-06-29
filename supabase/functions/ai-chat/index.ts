
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

    const { message, provider = 'openai', model = 'gpt-4o-mini', includeKnowledgeBase = true } = await req.json();

    console.log(`Processing chat request with provider: ${provider}, model: ${model}`);

    let knowledgeContext = '';
    if (includeKnowledgeBase) {
      const { data: knowledge } = await supabaseClient
        .from('knowledge_base')
        .select('title, content, category, tags')
        .eq('status', 'approved')
        .limit(10);

      if (knowledge && knowledge.length > 0) {
        knowledgeContext = `\n\nRelevant HR Knowledge Base:\n${knowledge.map(k => 
          `Title: ${k.title}\nCategory: ${k.category}\nContent: ${k.content}\nTags: ${k.tags?.join(', ')}`
        ).join('\n\n')}`;
      }
    }

    const systemPrompt = `You are an expert HR AI companion with deep knowledge of global employment laws, workplace culture, and HR best practices. You provide accurate, actionable advice while being professional and empathetic.

Key areas of expertise:
- Employment law and compliance across different regions
- Recruitment and talent acquisition strategies
- Performance management and employee development
- Workplace culture and employee engagement
- Conflict resolution and employee relations
- Compensation and benefits design
- Learning and development programs

Always provide practical, region-appropriate advice and cite relevant regulations when applicable.${knowledgeContext}`;

    let response;
    
    if (provider === 'openai') {
      const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAIApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      console.log('Making request to OpenAI API...');
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      return new Response(JSON.stringify({ response: aiResponse, provider: 'openai' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (provider === 'gemini') {
      const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
      if (!geminiApiKey) {
        throw new Error('Gemini API key not configured');
      }

      console.log('Making request to Gemini API...');
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API error:', errorData);
        throw new Error(`Gemini API error: ${response.status} ${errorData}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;

      return new Response(JSON.stringify({ response: aiResponse, provider: 'gemini' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid AI provider specified');

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
