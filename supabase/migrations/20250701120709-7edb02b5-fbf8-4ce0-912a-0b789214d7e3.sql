
-- Drop all existing tables in the correct order (child tables first to avoid foreign key constraints)
DROP TABLE IF EXISTS public.historique_achat CASCADE;
DROP TABLE IF EXISTS public.panier CASCADE;
DROP TABLE IF EXISTS public.commande CASCADE;
DROP TABLE IF EXISTS public.produit_offer CASCADE;
DROP TABLE IF EXISTS public.produit CASCADE;
DROP TABLE IF EXISTS public.utilisateur CASCADE;

-- Drop other existing tables that might still be present
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.order_details CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.wishlist CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.product_sizes CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop all sequences
DROP SEQUENCE IF EXISTS public.utilisateur_id_utilisateur_seq CASCADE;
DROP SEQUENCE IF EXISTS public.produit_id_produit_seq CASCADE;
DROP SEQUENCE IF EXISTS public.produit_offer_id_offer_seq CASCADE;
DROP SEQUENCE IF EXISTS public.commande_id_commande_seq CASCADE;
DROP SEQUENCE IF EXISTS public.panier_id_panier_seq CASCADE;
DROP SEQUENCE IF EXISTS public.historique_achat_id_historique_seq CASCADE;
DROP SEQUENCE IF EXISTS public.cart_items_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.order_details_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.orders_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.reviews_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.wishlist_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.product_images_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.product_sizes_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.products_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.categories_id_seq CASCADE;

-- Drop any remaining functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
