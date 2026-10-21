
-- Améliorer la table utilisateur pour supporter la connexion par téléphone
ALTER TABLE public.utilisateur 
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Créer un index unique sur le numéro de téléphone pour éviter les doublons
CREATE UNIQUE INDEX IF NOT EXISTS idx_utilisateur_telephone 
ON public.utilisateur(numero_telephone) 
WHERE numero_telephone IS NOT NULL;

-- Améliorer la table panier pour une meilleure gestion
ALTER TABLE public.panier 
ADD COLUMN IF NOT EXISTS size VARCHAR(10),
ADD COLUMN IF NOT EXISTS color VARCHAR(50),
ADD COLUMN IF NOT EXISTS prix_unitaire DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS statut VARCHAR(20) DEFAULT 'actif';

-- Améliorer la table commande
ALTER TABLE public.commande 
ADD COLUMN IF NOT EXISTS statut VARCHAR(50) DEFAULT 'en_attente',
ADD COLUMN IF NOT EXISTS total DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS adresse_livraison TEXT,
ADD COLUMN IF NOT EXISTS methode_paiement VARCHAR(50),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Créer une table de détails de commande pour une meilleure structure
CREATE TABLE IF NOT EXISTS public.commande_details (
  id_detail SERIAL PRIMARY KEY,
  id_commande INTEGER REFERENCES public.commande(id_commande) ON DELETE CASCADE,
  id_produit INTEGER REFERENCES public.produit(id_produit),
  quantite INTEGER NOT NULL DEFAULT 1,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  size VARCHAR(10),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Fonction pour calculer le total d'une commande
CREATE OR REPLACE FUNCTION calculate_order_total(order_id INTEGER)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    total_amount DECIMAL(10,2);
BEGIN
    SELECT COALESCE(SUM(quantite * prix_unitaire), 0)
    INTO total_amount
    FROM public.commande_details
    WHERE id_commande = order_id;
    
    RETURN total_amount;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement le total des commandes
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE public.commande 
        SET total = calculate_order_total(OLD.id_commande),
            updated_at = NOW()
        WHERE id_commande = OLD.id_commande;
        RETURN OLD;
    ELSE
        UPDATE public.commande 
        SET total = calculate_order_total(NEW.id_commande),
            updated_at = NOW()
        WHERE id_commande = NEW.id_commande;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_order_total ON public.commande_details;
CREATE TRIGGER trigger_update_order_total
    AFTER INSERT OR UPDATE OR DELETE ON public.commande_details
    FOR EACH ROW EXECUTE FUNCTION update_order_total();
