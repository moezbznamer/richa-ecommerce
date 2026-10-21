-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can access own cart" ON public.panier;

-- Create a simple policy that uses auth.jwt() which is already available
CREATE POLICY "Users can view their own cart items" 
ON public.panier 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.utilisateur 
    WHERE utilisateur.id_utilisateur = panier.id_utilisateur 
    AND utilisateur.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Users can insert their own cart items" 
ON public.panier 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.utilisateur 
    WHERE utilisateur.id_utilisateur = panier.id_utilisateur 
    AND utilisateur.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Users can update their own cart items" 
ON public.panier 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.utilisateur 
    WHERE utilisateur.id_utilisateur = panier.id_utilisateur 
    AND utilisateur.email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Users can delete their own cart items" 
ON public.panier 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.utilisateur 
    WHERE utilisateur.id_utilisateur = panier.id_utilisateur 
    AND utilisateur.email = auth.jwt() ->> 'email'
  )
);