
-- Ajouter les colonnes manquantes à la table produit
ALTER TABLE public.produit 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS taille TEXT;

-- Vérifier que nom et prix existent déjà (ils devraient exister)
-- Si ils n'existent pas, les ajouter
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'produit' AND column_name = 'nom') THEN
        ALTER TABLE public.produit ADD COLUMN nom TEXT NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'produit' AND column_name = 'prix') THEN
        ALTER TABLE public.produit ADD COLUMN prix DECIMAL(10,2) NOT NULL DEFAULT 0;
    END IF;
END
$$;

-- Mettre à jour les produits existants avec des images
UPDATE public.produit SET 
  image_url = CASE 
    WHEN type_produit = 'man' AND nom LIKE '%Chemise%' THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop'
    WHEN type_produit = 'man' AND nom LIKE '%Veste%' THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop'
    WHEN type_produit = 'woman' AND nom LIKE '%Robe%' THEN 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop'
    WHEN type_produit = 'woman' AND nom LIKE '%Blouse%' THEN 'https://images.unsplash.com/photo-1564257577-6385c8b64d1a?w=400&h=500&fit=crop'
    WHEN type_produit = 'girl' AND nom LIKE '%T-shirt%' THEN 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop'
    WHEN type_produit = 'girl' AND nom LIKE '%Robe%' THEN 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop'
    WHEN type_produit = 'boy' AND nom LIKE '%Polo%' THEN 'https://images.unsplash.com/photo-1503342304451-692ae8bb171a?w=400&h=500&fit=crop'
    WHEN type_produit = 'boy' AND nom LIKE '%Short%' THEN 'https://images.unsplash.com/photo-1519087346834-de4dbf23dd01?w=400&h=500&fit=crop'
    WHEN type_produit = 'sport' AND nom LIKE '%Chaussures%' THEN 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop'
    WHEN type_produit = 'sport' AND nom LIKE '%Survêtement%' THEN 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5a?w=400&h=500&fit=crop'
    ELSE 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop'
  END
WHERE image_url IS NULL;
