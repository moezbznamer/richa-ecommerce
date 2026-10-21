
-- Ajouter une colonne discount_percentage à la table produit_offer
ALTER TABLE public.produit_offer 
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5,2) DEFAULT 0;

-- Mettre à jour quelques offres existantes avec des remises pour les tests
UPDATE public.produit_offer 
SET discount_percentage = 25 
WHERE id_offer IN (SELECT id_offer FROM public.produit_offer LIMIT 3);

UPDATE public.produit_offer 
SET discount_percentage = 15 
WHERE id_offer NOT IN (SELECT id_offer FROM public.produit_offer ORDER BY id_offer LIMIT 3) 
AND id_offer IN (SELECT id_offer FROM public.produit_offer LIMIT 5);
