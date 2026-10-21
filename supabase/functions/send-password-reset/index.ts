
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  resetLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetLink }: PasswordResetRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "RRICHA <onboarding@resend.dev>",
      to: [email],
      subject: "Réinitialisation de votre mot de passe RRICHA",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Réinitialisation de mot de passe - RRICHA</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border-radius: 12px; padding: 40px; border: 1px solid #d4af37;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #d4af37; font-size: 32px; margin: 0; font-weight: bold; letter-spacing: 2px;">RRICHA</h1>
                <p style="color: #cccccc; margin: 10px 0 0 0; font-size: 14px;">Mode & Élégance</p>
              </div>
              
              <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 20px; text-align: center;">Réinitialisation de mot de passe</h2>
              
              <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Bonjour,
              </p>
              
              <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Vous avez demandé la réinitialisation de votre mot de passe pour votre compte RRICHA. 
                Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${resetLink}" 
                   style="background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); 
                          color: #000000; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block; 
                          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">
                  Réinitialiser mon mot de passe
                </a>
              </div>
              
              <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                Ce lien est valide pendant <strong style="color: #d4af37;">15 minutes</strong> pour des raisons de sécurité.
              </p>
              
              <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
              </p>
              
              <div style="border-top: 1px solid #333333; padding-top: 20px; margin-top: 30px;">
                <p style="color: #888888; font-size: 12px; text-align: center; margin: 0;">
                  © 2024 RRICHA - Mode & Élégance<br>
                  Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email de réinitialisation envoyé:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erreur lors de l'envoi de l'email:", error);
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
