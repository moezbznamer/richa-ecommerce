import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get user from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const url = new URL(req.url)
    const method = req.method

    if (method === 'GET') {
      // Get user level info
      console.log('Getting level info for user:', user.email)
      
      const { data, error } = await supabase
        .rpc('get_user_level_info', { user_email: user.email })

      if (error) {
        console.error('Error getting user level info:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to get level info' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const levelInfo = data[0] || {
        total_spent: 0,
        current_level: 1,
        progress_percentage: 0,
        next_milestone: 100,
        badge_name: 'None'
      }

      console.log('Returning level info:', levelInfo)
      return new Response(
        JSON.stringify(levelInfo),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (method === 'POST') {
      // Simulate spending for testing
      console.log('Processing spending simulation')
      
      let requestBody = {};
      let bodyText = '';
      
      try {
        bodyText = await req.text();
        console.log('Raw request body:', bodyText)
        
        if (bodyText && bodyText.trim()) {
          requestBody = JSON.parse(bodyText);
        }
      } catch (error) {
        console.error('Error parsing request body:', error, 'Raw body:', bodyText);
        return new Response(
          JSON.stringify({ error: 'Invalid JSON in request body' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const { amount } = requestBody as { amount?: number };
      
      if (amount === undefined || amount === null || typeof amount !== 'number') {
        console.log('Invalid amount received:', amount, 'Type:', typeof amount)
        return new Response(
          JSON.stringify({ error: 'Amount is required and must be a number' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Update user's total_spent using RPC for simulation
      const { data, error } = await supabase
        .rpc('simulate_spending_change', { 
          user_email: user.email,
          amount_change: amount 
        })

      if (error) {
        console.error('Error simulating spending change:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to simulate spending' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const levelInfo = data[0] || {
        total_spent: 0,
        current_level: 1,
        progress_percentage: 0,
        next_milestone: 100,
        badge_name: 'None'
      }

      return new Response(
        JSON.stringify(levelInfo),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})