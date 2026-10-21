
-- Drop all existing tables in the correct order (child tables first)
DROP TABLE IF EXISTS public.commande_produit CASCADE;
DROP TABLE IF EXISTS public.commande CASCADE;
DROP TABLE IF EXISTS public.pannier_produit CASCADE;
DROP TABLE IF EXISTS public.pannier CASCADE;
DROP TABLE IF EXISTS public.produit_offer CASCADE;
DROP TABLE IF EXISTS public.produit_boy CASCADE;
DROP TABLE IF EXISTS public.produit_girl CASCADE;
DROP TABLE IF EXISTS public.produit_woman CASCADE;
DROP TABLE IF EXISTS public.produit_man CASCADE;
DROP TABLE IF EXISTS public.produit CASCADE;
DROP TABLE IF EXISTS public.utilisateur CASCADE;

-- Drop sequences if they exist
DROP SEQUENCE IF EXISTS commande_numero_seq CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS public.generate_numero_commande() CASCADE;
DROP FUNCTION IF EXISTS public.set_numero_commande() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- 🛍️ TABLE: utilisateur
CREATE TABLE public.utilisateur (
    id_utilisateur SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe TEXT NOT NULL,
    adresse TEXT,
    telephone VARCHAR(20),
    sexe VARCHAR(10), -- 'homme', 'femme', etc.
    date_naissance DATE,
    date_inscription TIMESTAMP DEFAULT NOW()
);

-- 🛒 TABLE: produit (produit général)
CREATE TABLE public.produit (
    id_produit SERIAL PRIMARY KEY,
    nom_produit VARCHAR(150) NOT NULL,
    description TEXT,
    prix DECIMAL(10, 2) NOT NULL,
    image_path TEXT, -- ex: 'images/produits/1.jpg'
    categorie VARCHAR(20) CHECK (categorie IN ('man', 'woman', 'girl', 'boy')),
    en_stock BOOLEAN DEFAULT TRUE,
    date_ajout TIMESTAMP DEFAULT NOW()
);

-- 🏷️ TABLE: produit_offer (pour afficher dans la page d'accueil)
CREATE TABLE public.produit_offer (
    id_offer SERIAL PRIMARY KEY,
    id_produit INT REFERENCES public.produit(id_produit) ON DELETE CASCADE,
    pourcentage_reduction INT CHECK (pourcentage_reduction BETWEEN 0 AND 100),
    date_debut DATE,
    date_fin DATE
);

-- 👔 TABLE: produit_man (produits spécifiques aux hommes)
CREATE TABLE public.produit_man (
    id_produit INT PRIMARY KEY REFERENCES public.produit(id_produit) ON DELETE CASCADE,
    taille VARCHAR(10),   -- ex: S, M, L, XL
    couleur VARCHAR(50),
    type_matiere VARCHAR(100)
);

-- 👗 TABLE: produit_woman
CREATE TABLE public.produit_woman (
    id_produit INT PRIMARY KEY REFERENCES public.produit(id_produit) ON DELETE CASCADE,
    taille VARCHAR(10),
    couleur VARCHAR(50),
    style VARCHAR(100)
);

-- 👧 TABLE: produit_girl
CREATE TABLE public.produit_girl (
    id_produit INT PRIMARY KEY REFERENCES public.produit(id_produit) ON DELETE CASCADE,
    age_recommande INT,
    couleur VARCHAR(50)
);

-- 👦 TABLE: produit_boy
CREATE TABLE public.produit_boy (
    id_produit INT PRIMARY KEY REFERENCES public.produit(id_produit) ON DELETE CASCADE,
    age_recommande INT,
    couleur VARCHAR(50)
);

-- 🛒 TABLE: pannier
CREATE TABLE public.pannier (
    id_pannier SERIAL PRIMARY KEY,
    id_utilisateur INT REFERENCES public.utilisateur(id_utilisateur) ON DELETE CASCADE,
    date_creation TIMESTAMP DEFAULT NOW()
);

-- 🛍️ TABLE: pannier_produit (produits dans un panier)
CREATE TABLE public.pannier_produit (
    id_pannier INT REFERENCES public.pannier(id_pannier) ON DELETE CASCADE,
    id_produit INT REFERENCES public.produit(id_produit) ON DELETE CASCADE,
    quantite INT CHECK (quantite > 0),
    PRIMARY KEY (id_pannier, id_produit)
);

-- Create indexes for better performance
CREATE INDEX idx_produit_categorie ON public.produit(categorie);
CREATE INDEX idx_produit_stock ON public.produit(en_stock);
CREATE INDEX idx_pannier_utilisateur ON public.pannier(id_utilisateur);

-- Enable Row Level Security on user-related tables
ALTER TABLE public.utilisateur ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pannier ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pannier_produit ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products and offers
CREATE POLICY "Anyone can view products" 
  ON public.produit FOR SELECT 
  TO public USING (true);

CREATE POLICY "Anyone can view product details" 
  ON public.produit_man FOR SELECT 
  TO public USING (true);

CREATE POLICY "Anyone can view product details" 
  ON public.produit_woman FOR SELECT 
  TO public USING (true);

CREATE POLICY "Anyone can view product details" 
  ON public.produit_girl FOR SELECT 
  TO public USING (true);

CREATE POLICY "Anyone can view product details" 
  ON public.produit_boy FOR SELECT 
  TO public USING (true);

CREATE POLICY "Anyone can view offers" 
  ON public.produit_offer FOR SELECT 
  TO public USING (true);

-- Create RLS policies for users to access their own data
CREATE POLICY "Users can view their own profile" 
  ON public.utilisateur FOR SELECT 
  USING (auth.uid()::text = id_utilisateur::text);

CREATE POLICY "Users can update their own profile" 
  ON public.utilisateur FOR UPDATE 
  USING (auth.uid()::text = id_utilisateur::text);

CREATE POLICY "Users can view their own cart" 
  ON public.pannier FOR ALL 
  USING (auth.uid()::text = id_utilisateur::text);

CREATE POLICY "Users can manage their cart items" 
  ON public.pannier_produit FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.pannier 
    WHERE public.pannier.id_pannier = pannier_produit.id_pannier 
    AND public.pannier.id_utilisateur::text = auth.uid()::text
  ));
