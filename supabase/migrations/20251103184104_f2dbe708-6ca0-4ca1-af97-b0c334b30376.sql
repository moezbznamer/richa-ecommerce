-- Create function to update user level when order is completed
CREATE OR REPLACE FUNCTION public.update_user_level_on_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email text;
  order_total numeric;
  new_total_spent numeric;
  new_level integer;
BEGIN
  -- Only process when order status changes to completed/delivered
  IF (TG_OP = 'UPDATE' AND NEW.statut IN ('complété', 'livré', 'completed', 'delivered')) 
     OR (TG_OP = 'INSERT' AND NEW.statut IN ('complété', 'livré', 'completed', 'delivered')) THEN
    
    -- Get user email from utilisateur table
    SELECT u.email INTO user_email
    FROM public.utilisateur u
    WHERE u.id_utilisateur = NEW.id_utilisateur;
    
    -- If user email not found, exit
    IF user_email IS NULL THEN
      RETURN NEW;
    END IF;
    
    -- Get order total
    order_total := COALESCE(NEW.total, 0);
    
    -- Insert or update niveau record
    INSERT INTO public.niveau (email, montant_spent, niveau)
    VALUES (user_email, order_total, FLOOR(order_total / 1000)::integer)
    ON CONFLICT (email) 
    DO UPDATE SET
      montant_spent = public.niveau.montant_spent + order_total,
      niveau = FLOOR((public.niveau.montant_spent + order_total) / 1000)::integer,
      updated_at = now();
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on commande table
DROP TRIGGER IF EXISTS trigger_update_user_level ON public.commande;
CREATE TRIGGER trigger_update_user_level
  AFTER INSERT OR UPDATE OF statut
  ON public.commande
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_level_on_order();

-- Add unique constraint on email in niveau table if not exists
ALTER TABLE public.niveau DROP CONSTRAINT IF EXISTS niveau_email_key;
ALTER TABLE public.niveau ADD CONSTRAINT niveau_email_key UNIQUE (email);