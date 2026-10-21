-- Fix the last function with search_path warning

-- Update get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH me AS (
    SELECT auth.uid() AS uid
  )
  SELECT COALESCE((
    SELECT role FROM public.admin_users au
    JOIN me ON au.user_id = me.uid
    LIMIT 1
  ), 'customer')::text;
$$;