-- Remove image_url column from produit table
ALTER TABLE public.produit DROP COLUMN IF EXISTS image_url;