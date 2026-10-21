-- Drop existing RLS policies on panier table
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.panier;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.panier;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.panier;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.panier;

-- Create new simplified RLS policies for panier table that work with the existing auth system
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