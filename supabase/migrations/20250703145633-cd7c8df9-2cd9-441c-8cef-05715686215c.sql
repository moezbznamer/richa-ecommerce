
-- Créer la table produit avec les types requis
CREATE TABLE public.produit (
  id_produit SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT,
  prix DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  taille TEXT,
  nombre_en_stock INTEGER DEFAULT 0 CHECK (nombre_en_stock >= 0),
  type_produit TEXT CHECK (type_produit IN ('man', 'woman', 'girl', 'boy', 'sport')),
  couleur_disponible TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer Row Level Security
ALTER TABLE public.produit ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour permettre à tout le monde de voir les produits
CREATE POLICY "Anyone can view products" ON public.produit
  FOR SELECT USING (true);

-- Politique RLS pour les admins pour gérer les produits
CREATE POLICY "Admins can manage products" ON public.produit
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Insérer quelques produits d'exemple
INSERT INTO public.produit (nom, description, prix, image_url, taille, nombre_en_stock, type_produit, couleur_disponible) VALUES
('Chemise Homme Classic', 'Chemise élégante pour homme', 89.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop', 'L', 15, 'man', 'Blanc, Bleu'),
('Veste Homme Premium', 'Veste de costume haut de gamme', 299.99, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', 'M', 8, 'man', 'Noir, Gris'),
('Robe Femme Élégante', 'Robe de soirée sophistiquée', 159.99, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop', 'S', 12, 'woman', 'Rouge, Noir'),
('Blouse Femme Chic', 'Blouse moderne et confortable', 79.99, 'https://images.unsplash.com/photo-1564257577-6385c8b64d1a?w=400&h=500&fit=crop', 'M', 20, 'woman', 'Blanc, Rose'),
('T-shirt Fille Fun', 'T-shirt coloré pour petites filles', 29.99, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop', '8-10 ans', 25, 'girl', 'Rose, Violet'),
('Robe Fille Princesse', 'Robe de fête pour petites filles', 69.99, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop', '6-8 ans', 18, 'girl', 'Rose, Blanc'),
('Polo Garçon Classic', 'Polo confortable pour garçons', 39.99, 'https://images.unsplash.com/photo-1503342304451-692ae8bb171a?w=400&h=500&fit=crop', '10-12 ans', 22, 'boy', 'Bleu, Vert'),
('Short Garçon Sport', 'Short de sport pour garçons', 24.99, 'https://images.unsplash.com/photo-1519087346834-de4dbf23dd01?w=400&h=500&fit=crop', '8-10 ans', 30, 'boy', 'Noir, Bleu'),
('Chaussures Sport Running', 'Chaussures de course professionnelles', 149.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop', '42', 15, 'sport', 'Noir, Blanc'),
('Survêtement Sport Pro', 'Ensemble de sport haute performance', 119.99, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5a?w=400&h=500&fit=crop', 'L', 10, 'sport', 'Noir, Gris');
