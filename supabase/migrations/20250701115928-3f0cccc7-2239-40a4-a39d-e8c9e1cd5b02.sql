
-- Drop existing tables and recreate with the new schema
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

-- Drop sequences
DROP SEQUENCE IF EXISTS public.produit_id_produit_seq CASCADE;
DROP SEQUENCE IF EXISTS public.produit_offer_id_offer_seq CASCADE;
DROP SEQUENCE IF EXISTS public.pannier_id_pannier_seq CASCADE;
DROP SEQUENCE IF EXISTS public.utilisateur_id_utilisateur_seq CASCADE;

-- Create table for users
CREATE TABLE public.utilisateur (
    id_utilisateur SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_creation_compte TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for products
CREATE TABLE public.produit (
    id_produit SERIAL PRIMARY KEY,
    image_url TEXT,
    taille VARCHAR(10),
    nombre_en_stock INTEGER CHECK (nombre_en_stock >= 0),
    type_produit VARCHAR(20) CHECK (type_produit IN ('man', 'woman', 'girl', 'boy', 'sport')),
    couleur_disponible TEXT
);

-- Create table for product offers
CREATE TABLE public.produit_offer (
    id_offer SERIAL PRIMARY KEY,
    id_produit INTEGER REFERENCES public.produit(id_produit) ON DELETE CASCADE,
    image_url TEXT,
    taille VARCHAR(10),
    date_debut DATE DEFAULT CURRENT_DATE,
    date_fin DATE,
    nombre_disponible INTEGER CHECK (nombre_disponible >= 0)
);

-- Create table for orders
CREATE TABLE public.commande (
    id_commande SERIAL PRIMARY KEY,
    id_utilisateur INTEGER REFERENCES public.utilisateur(id_utilisateur) ON DELETE CASCADE,
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to associate products with orders (panier / cart items)
CREATE TABLE public.panier (
    id_panier SERIAL PRIMARY KEY,
    id_commande INTEGER REFERENCES public.commande(id_commande) ON DELETE CASCADE,
    id_produit INTEGER REFERENCES public.produit(id_produit) ON DELETE CASCADE,
    id_utilisateur INTEGER REFERENCES public.utilisateur(id_utilisateur) ON DELETE CASCADE,
    quantite INTEGER DEFAULT 1 CHECK (quantite > 0),
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for purchase history
CREATE TABLE public.historique_achat (
    id_historique SERIAL PRIMARY KEY,
    id_utilisateur INTEGER REFERENCES public.utilisateur(id_utilisateur) ON DELETE CASCADE,
    id_produit INTEGER REFERENCES public.produit(id_produit) ON DELETE CASCADE,
    date_achat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantite INTEGER DEFAULT 1 CHECK (quantite > 0)
);

-- Enable Row Level Security
ALTER TABLE public.utilisateur ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produit_offer ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commande ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panier ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historique_achat ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.utilisateur FOR SELECT 
  USING (auth.uid()::text = id_utilisateur::text);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
  ON public.utilisateur FOR UPDATE 
  USING (auth.uid()::text = id_utilisateur::text);

-- Anyone can view products
CREATE POLICY "Anyone can view products" 
  ON public.produit FOR SELECT 
  TO public USING (true);

-- Anyone can view product offers
CREATE POLICY "Anyone can view product offers" 
  ON public.produit_offer FOR SELECT 
  TO public USING (true);

-- Users can view their own orders
CREATE POLICY "Users can view their own orders" 
  ON public.commande FOR SELECT 
  USING (auth.uid()::text = id_utilisateur::text);

-- Users can create their own orders
CREATE POLICY "Users can create their own orders" 
  ON public.commande FOR INSERT 
  WITH CHECK (auth.uid()::text = id_utilisateur::text);

-- Users can manage their own cart items
CREATE POLICY "Users can manage their own cart items" 
  ON public.panier FOR ALL 
  USING (auth.uid()::text = id_utilisateur::text);

-- Users can view their own purchase history
CREATE POLICY "Users can view their own purchase history" 
  ON public.historique_achat FOR SELECT 
  USING (auth.uid()::text = id_utilisateur::text);

-- Users can create their own purchase history
CREATE POLICY "Users can create their own purchase history" 
  ON public.historique_achat FOR INSERT 
  WITH CHECK (auth.uid()::text = id_utilisateur::text);

-- Create indexes for better performance
CREATE INDEX idx_utilisateur_email ON public.utilisateur(email);
CREATE INDEX idx_produit_type ON public.produit(type_produit);
CREATE INDEX idx_produit_offer_dates ON public.produit_offer(date_debut, date_fin);
CREATE INDEX idx_commande_utilisateur ON public.commande(id_utilisateur);
CREATE INDEX idx_panier_utilisateur ON public.panier(id_utilisateur);
CREATE INDEX idx_historique_utilisateur ON public.historique_achat(id_utilisateur);
