-- Fix search_path for existing functions to resolve security warnings

-- Update calculate_order_total function
CREATE OR REPLACE FUNCTION public.calculate_order_total(order_id bigint)
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(cd.prix_unitaire * cd.quantite), 0)
  FROM public.commande_details cd
  WHERE cd.id_commande = order_id;
$$;

-- Update get_user_level_info function
CREATE OR REPLACE FUNCTION public.get_user_level_info(user_email text)
RETURNS TABLE(badge_name text, current_level integer, next_milestone numeric, progress_percentage numeric, total_spent numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH lv AS (
    SELECT n.niveau, n.montant_spent
    FROM public.niveau n
    WHERE n.email = user_email
    LIMIT 1
  )
  SELECT
    CASE
      WHEN lv.niveau >= 5 THEN 'Elite'
      WHEN lv.niveau >= 3 THEN 'Gold'
      WHEN lv.niveau >= 1 THEN 'Silver'
      ELSE 'Bronze'
    END AS badge_name,
    COALESCE(lv.niveau, 0) AS current_level,
    GREATEST(0, ((COALESCE(lv.niveau,0)+1) * 1000) - COALESCE(lv.montant_spent,0)) AS next_milestone,
    CASE
      WHEN COALESCE(lv.montant_spent,0) = 0 THEN 0
      ELSE LEAST(100, ROUND((COALESCE(lv.montant_spent,0) / ((COALESCE(lv.niveau,0)+1) * 1000)::numeric) * 100, 2))
    END AS progress_percentage,
    COALESCE(lv.montant_spent, 0) AS total_spent
  FROM lv;
$$;

-- Update simulate_spending_change function
CREATE OR REPLACE FUNCTION public.simulate_spending_change(user_email text, amount_change numeric)
RETURNS TABLE(badge_name text, current_level integer, next_milestone numeric, progress_percentage numeric, total_spent numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH base AS (
    SELECT COALESCE(n.niveau, 0) AS niveau, COALESCE(n.montant_spent, 0) AS montant_spent
    FROM public.niveau n
    WHERE n.email = user_email
    LIMIT 1
  ),
  sim AS (
    SELECT niveau, montant_spent + amount_change AS total_spent
    FROM base
  )
  SELECT
    CASE
      WHEN sim.niveau >= 5 THEN 'Elite'
      WHEN sim.niveau >= 3 THEN 'Gold'
      WHEN sim.niveau >= 1 THEN 'Silver'
      ELSE 'Bronze'
    END AS badge_name,
    sim.niveau AS current_level,
    GREATEST(0, ((sim.niveau+1) * 1000) - sim.total_spent) AS next_milestone,
    CASE
      WHEN sim.total_spent = 0 THEN 0
      ELSE LEAST(100, ROUND((sim.total_spent / ((sim.niveau+1) * 1000)::numeric) * 100, 2))
    END AS progress_percentage,
    sim.total_spent
  FROM sim;
$$;

-- Update log_admin_action function
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action_type text,
  p_table_name text,
  p_record_id text,
  p_old_values jsonb DEFAULT NULL::jsonb,
  p_new_values jsonb DEFAULT NULL::jsonb
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.admin_audit (admin_user_id, action_type, table_name, record_id, old_values, new_values)
  SELECT au.id, p_action_type, p_table_name, p_record_id, p_old_values, p_new_values
  FROM public.admin_users au
  WHERE au.user_id = auth.uid()
  LIMIT 1;
$$;

-- Update sync_profiles_to_utilisateur function
CREATE OR REPLACE FUNCTION public.sync_profiles_to_utilisateur()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.utilisateur (email, mot_de_passe)
  SELECT p.email, ''
  FROM public.profiles p
  LEFT JOIN public.utilisateur u ON u.email = p.email
  WHERE p.email IS NOT NULL AND u.id_utilisateur IS NULL;
$$;

-- Update update_niveau_updated_at function
CREATE OR REPLACE FUNCTION public.update_niveau_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update set_updated_at function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;