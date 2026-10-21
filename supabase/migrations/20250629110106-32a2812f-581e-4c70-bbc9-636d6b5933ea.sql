
-- Create utilisateur table for user details
CREATE TABLE public.utilisateur (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mot_de_passe VARCHAR(255) NOT NULL,
  adresse TEXT,
  telephone VARCHAR(20),
  sexe VARCHAR(10) CHECK (sexe IN ('homme', 'femme', 'autre')),
  date_naissance DATE,
  date_inscription TIMESTAMP WITH TIME ZONE DEFAULT now(),
  est_actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create general produit table
CREATE TABLE public.produit (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  prix DECIMAL(10,2) NOT NULL CHECK (prix >= 0),
  chemin_image VARCHAR(500),
  categorie VARCHAR(20) NOT NULL CHECK (categorie IN ('man', 'woman', 'girl', 'boy')),
  stock_disponible BOOLEAN DEFAULT true,
  quantite_stock INTEGER DEFAULT 0 CHECK (quantite_stock >= 0),
  date_ajout TIMESTAMP WITH TIME ZONE DEFAULT now(),
  est_actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create produit_man table for men's clothing
CREATE TABLE public.produit_man (
  id SERIAL PRIMARY KEY,
  produit_id INTEGER REFERENCES public.produit(id) ON DELETE CASCADE,
  taille VARCHAR(10) NOT NULL CHECK (taille IN ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL')),
  couleur VARCHAR(50) NOT NULL,
  matiere VARCHAR(100),
  style VARCHAR(50),
  marque VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(produit_id, taille, couleur)
);

-- Create produit_woman table for women's clothing  
CREATE TABLE public.produit_woman (
  id SERIAL PRIMARY KEY,
  produit_id INTEGER REFERENCES public.produit(id) ON DELETE CASCADE,
  taille VARCHAR(10) NOT NULL CHECK (taille IN ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL')),
  couleur VARCHAR(50) NOT NULL,
  matiere VARCHAR(100),
  style VARCHAR(50),
  marque VARCHAR(100),
  coupe VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(produit_id, taille, couleur)
);

-- Create produit_girl table for girls' clothing
CREATE TABLE public.produit_girl (
  id SERIAL PRIMARY KEY,
  produit_id INTEGER REFERENCES public.produit(id) ON DELETE CASCADE,
  taille VARCHAR(10) NOT NULL,
  couleur VARCHAR(50) NOT NULL,
  matiere VARCHAR(100),
  age_recommande VARCHAR(20),
  style VARCHAR(50),
  marque VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(produit_id, taille, couleur)
);

-- Create produit_boy table for boys' clothing
CREATE TABLE public.produit_boy (
  id SERIAL PRIMARY KEY,
  produit_id INTEGER REFERENCES public.produit(id) ON DELETE CASCADE,
  taille VARCHAR(10) NOT NULL,
  couleur VARCHAR(50) NOT NULL,
  matiere VARCHAR(100),
  age_recommande VARCHAR(20),
  style VARCHAR(50),
  marque VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(produit_id, taille, couleur)
);

-- Create produit_offer table for discounted products
CREATE TABLE public.produit_offer (
  id SERIAL PRIMARY KEY,
  produit_id INTEGER REFERENCES public.produit(id) ON DELETE CASCADE,
  pourcentage_reduction INTEGER NOT NULL CHECK (pourcentage_reduction > 0 AND pourcentage_reduction <= 100),
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  est_actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT check_dates CHECK (date_fin > date_debut),
  UNIQUE(produit_id, date_debut, date_fin)
);

-- Create pannier table for shopping carts
CREATE TABLE public.pannier (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id UUID REFERENCES public.utilisateur(id) ON DELETE CASCADE,
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT now(),
  date_modification TIMESTAMP WITH TIME ZONE DEFAULT now(),
  est_actif BOOLEAN DEFAULT true
);

-- Create pannier_produit table for cart items
CREATE TABLE public.pannier_produit (
  id SERIAL PRIMARY KEY,
  pannier_id UUID REFERENCES public.pannier(id) ON DELETE CASCADE,
  produit_id INTEGER REFERENCES public.produit(id) ON DELETE CASCADE,
  quantite INTEGER NOT NULL DEFAULT 1 CHECK (quantite > 0),
  taille VARCHAR(10),
  couleur VARCHAR(50),
  prix_unitaire DECIMAL(10,2) NOT NULL CHECK (prix_unitaire >= 0),
  date_ajout TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(pannier_id, produit_id, taille, couleur)
);

-- Create commande table for orders
CREATE TABLE public.commande (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id UUID REFERENCES public.utilisateur(id) ON DELETE SET NULL,
  numero_commande VARCHAR(50) UNIQUE NOT NULL,
  total_prix DECIMAL(10,2) NOT NULL CHECK (total_prix >= 0),
  statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'confirmee', 'expediee', 'livree', 'annulee')),
  date_commande TIMESTAMP WITH TIME ZONE DEFAULT now(),
  date_livraison_prevue DATE,
  adresse_livraison TEXT NOT NULL,
  methode_paiement VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create commande_produit table for order items
CREATE TABLE public.commande_produit (
  id SERIAL PRIMARY KEY,
  commande_id UUID REFERENCES public.commande(id) ON DELETE CASCADE,
  produit_id INTEGER REFERENCES public.produit(id) ON DELETE SET NULL,
  quantite INTEGER NOT NULL CHECK (quantite > 0),
  taille VARCHAR(10),
  couleur VARCHAR(50),
  prix_unitaire DECIMAL(10,2) NOT NULL CHECK (prix_unitaire >= 0),
  prix_total DECIMAL(10,2) NOT NULL CHECK (prix_total >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_produit_categorie ON public.produit(categorie);
CREATE INDEX idx_produit_stock ON public.produit(stock_disponible);
CREATE INDEX idx_produit_offer_actif ON public.produit_offer(est_actif);
CREATE INDEX idx_produit_offer_dates ON public.produit_offer(date_debut, date_fin);
CREATE INDEX idx_pannier_utilisateur ON public.pannier(utilisateur_id);
CREATE INDEX idx_commande_utilisateur ON public.commande(utilisateur_id);
CREATE INDEX idx_commande_statut ON public.commande(statut);

-- Enable Row Level Security on user-related tables
ALTER TABLE public.utilisateur ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pannier ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pannier_produit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commande ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commande_produit ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users to access their own data
CREATE POLICY "Users can view their own profile" 
  ON public.utilisateur FOR SELECT 
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" 
  ON public.utilisateur FOR UPDATE 
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view their own cart" 
  ON public.pannier FOR ALL 
  USING (auth.uid()::text = utilisateur_id::text);

CREATE POLICY "Users can manage their cart items" 
  ON public.pannier_produit FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.pannier 
    WHERE public.pannier.id = pannier_produit.pannier_id 
    AND public.pannier.utilisateur_id::text = auth.uid()::text
  ));

CREATE POLICY "Users can view their own orders" 
  ON public.commande FOR SELECT 
  USING (auth.uid()::text = utilisateur_id::text);

CREATE POLICY "Users can view their own order items" 
  ON public.commande_produit FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.commande 
    WHERE public.commande.id = commande_produit.commande_id 
    AND public.commande.utilisateur_id::text = auth.uid()::text
  ));

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

CREATE POLICY "Anyone can view active offers" 
  ON public.produit_offer FOR SELECT 
  TO public USING (est_actif = true);

-- Create function to automatically generate order numbers
CREATE OR REPLACE FUNCTION public.generate_numero_commande()
RETURNS TEXT AS $$
BEGIN
  RETURN 'RCH-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('commande_numero_seq')::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS commande_numero_seq START 1;

-- Create trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION public.set_numero_commande()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero_commande IS NULL OR NEW.numero_commande = '' THEN
    NEW.numero_commande := public.generate_numero_commande();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_numero_commande
  BEFORE INSERT ON public.commande
  FOR EACH ROW
  EXECUTE FUNCTION public.set_numero_commande();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER trigger_utilisateur_updated_at
  BEFORE UPDATE ON public.utilisateur
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_produit_updated_at
  BEFORE UPDATE ON public.produit
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_produit_offer_updated_at
  BEFORE UPDATE ON public.produit_offer
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_pannier_updated_at
  BEFORE UPDATE ON public.pannier
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_commande_updated_at
  BEFORE UPDATE ON public.commande
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
