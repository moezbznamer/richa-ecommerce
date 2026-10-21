-- Drop the existing policy
DROP POLICY IF EXISTS "Users can access own cart" ON public.panier;

-- Create simplified RLS policies for panier table
CREATE POLICY "Users can access own cart" 
ON public.panier 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.utilisateur 
    WHERE utilisateur.id_utilisateur = panier.id_utilisateur 
    AND utilisateur.email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  )
);