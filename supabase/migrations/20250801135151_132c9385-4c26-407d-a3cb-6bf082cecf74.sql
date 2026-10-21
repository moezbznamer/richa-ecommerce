-- Add public read access to produit table for offers display
CREATE POLICY "Anyone can view products for offers" 
ON public.produit 
FOR SELECT 
TO authenticated, anon
USING (true);