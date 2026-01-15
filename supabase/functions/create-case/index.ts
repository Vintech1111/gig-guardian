import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateCaseRequest {
  email: string;
  name: string;
  phone?: string;
  platform: string;
  service: string;
  tier: string;
}

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, name, phone, platform, service, tier }: CreateCaseRequest = await req.json();

    console.log("Creating case for:", { email, name, platform, service, tier });

    // Generate unique token
    const token = generateToken();

    // Create case in database
    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .insert({
        token,
        email,
        name,
        phone,
        platform,
        service,
        tier,
        status: "pending_payment",
      })
      .select()
      .single();

    if (caseError) {
      console.error("Error creating case:", caseError);
      throw new Error("Failed to create case");
    }

    console.log("Case created:", caseData.id);

    // Get the base URL from the request origin or use a default
    const origin = req.headers.get("origin") || "https://your-app.lovable.app";
    const dashboardUrl = `${origin}/case/${token}`;

    return new Response(
      JSON.stringify({ 
        success: true, 
        caseId: caseData.id,
        token: token,
        dashboardUrl: dashboardUrl,
        message: "Case created successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in create-case function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);