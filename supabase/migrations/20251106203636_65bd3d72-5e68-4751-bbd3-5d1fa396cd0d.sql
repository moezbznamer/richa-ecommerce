-- Set default status to 'pending' for new orders
ALTER TABLE public.commande 
ALTER COLUMN statut SET DEFAULT 'pending';