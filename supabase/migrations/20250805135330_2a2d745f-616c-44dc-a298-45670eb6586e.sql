-- Enable RLS on panier table if not already enabled
ALTER TABLE public.panier ENABLE ROW LEVEL SECURITY;

-- Create policies for panier table to allow users to access their own cart items
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