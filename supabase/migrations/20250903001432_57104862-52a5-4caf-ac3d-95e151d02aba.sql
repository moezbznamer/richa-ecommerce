-- Allow users to delete their own orders
CREATE POLICY "Users can delete their own orders" 
ON public.commande 
FOR DELETE 
USING (id_utilisateur IN ( SELECT u.id_utilisateur
   FROM utilisateur u
  WHERE ((u.email)::text = (auth.jwt() ->> 'email'::text))));

-- Allow users to delete details for their own orders
CREATE POLICY "Users can delete their own order details" 
ON public.commande_details 
FOR DELETE 
USING (id_commande IN ( SELECT c.id_commande
   FROM (commande c
     JOIN utilisateur u ON ((c.id_utilisateur = u.id_utilisateur)))
  WHERE ((u.email)::text = (auth.jwt() ->> 'email'::text))));