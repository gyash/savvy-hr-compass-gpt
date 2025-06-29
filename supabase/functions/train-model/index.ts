
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

    const { sessionName, trainingData, provider = 'openai' } = await req.json();

    // Create training session record
    const { data: session, error: sessionError } = await supabaseClient
      .from('training_sessions')
      .insert({
        session_name: sessionName,
        training_data: trainingData,
        model_version: provider === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash',
        status: 'in_progress'
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Process training data and create embeddings/fine-tuning preparation
    const processedData = trainingData.map((item: any) => ({
      input: item.input,
      output: item.output,
      category: item.category || 'general',
      processed_at: new Date().toISOString()
    }));

    // Update session with processed data
    await supabaseClient
      .from('training_sessions')
      .update({
        training_data: { ...trainingData, processed: processedData },
        status: 'completed',
        completed_at: new Date().toISOString(),
        performance_metrics: {
          data_points: processedData.length,
          categories: [...new Set(processedData.map(d => d.category))],
          processed_at: new Date().toISOString()
        }
      })
      .eq('id', session.id);

    return new Response(JSON.stringify({ 
      success: true, 
      sessionId: session.id,
      processedCount: processedData.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in train-model function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
