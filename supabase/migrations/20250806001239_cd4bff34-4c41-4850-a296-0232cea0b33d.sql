-- Drop all existing policies on panier table
DROP POLICY IF EXISTS "Users can access own cart" ON public.panier;
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.panier;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.panier;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.panier;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.panier;

-- Create a single comprehensive policy that works with the current auth system
CREATE POLICY "Allow users to manage their own cart" 
ON public.panier 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.utilisateur 
    WHERE utilisateur.id_utilisateur = panier.id_utilisateur 
    AND utilisateur.email = auth.jwt() ->> 'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.utilisateur 
    WHERE utilisateur.id_utilisateur = panier.id_utilisateur 
    AND utilisateur.email = auth.jwt() ->> 'email'
  )
);