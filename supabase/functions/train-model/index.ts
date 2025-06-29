
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

    console.log(`Starting training session: ${sessionName} with provider: ${provider}`);
    console.log(`Training data count: ${trainingData.length}`);

    // Get current user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authentication required');
    }

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

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      throw sessionError;
    }

    console.log(`Created training session with ID: ${session.id}`);

    // Process training data and create embeddings/fine-tuning preparation
    const processedData = trainingData.map((item: any) => ({
      input: item.input,
      output: item.output,
      category: item.category || 'general',
      processed_at: new Date().toISOString()
    }));

    // Simulate training process (in a real implementation, this would involve actual model training)
    console.log('Processing training data...');
    
    // For demonstration, we'll validate the training data format
    const validationResults = processedData.map((item, index) => ({
      index,
      valid: item.input && item.output && item.input.length > 0 && item.output.length > 0,
      input_length: item.input?.length || 0,
      output_length: item.output?.length || 0
    }));

    const validCount = validationResults.filter(r => r.valid).length;
    const categories = [...new Set(processedData.map(d => d.category))];

    console.log(`Validation complete: ${validCount}/${processedData.length} valid examples`);
    console.log(`Categories found: ${categories.join(', ')}`);

    // Update session with processed data
    const { error: updateError } = await supabaseClient
      .from('training_sessions')
      .update({
        training_data: { original: trainingData, processed: processedData, validation: validationResults },
        status: 'completed',
        completed_at: new Date().toISOString(),
        performance_metrics: {
          total_examples: processedData.length,
          valid_examples: validCount,
          categories: categories,
          avg_input_length: validationResults.reduce((sum, r) => sum + r.input_length, 0) / validationResults.length,
          avg_output_length: validationResults.reduce((sum, r) => sum + r.output_length, 0) / validationResults.length,
          processed_at: new Date().toISOString()
        }
      })
      .eq('id', session.id);

    if (updateError) {
      console.error('Session update error:', updateError);
      throw updateError;
    }

    console.log('Training session completed successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      sessionId: session.id,
      processedCount: validCount,
      totalCount: processedData.length,
      categories: categories
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
