-- Fix infinite recursion in admin_users policies by creating security definer function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = 'public'
AS $$
  SELECT role FROM public.admin_users WHERE user_id = auth.uid();
$$;

-- Drop and recreate admin_users policies to fix infinite recursion
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;

CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

-- Update other policies that reference admin_users to use the function
DROP POLICY IF EXISTS "Admin only access to utilisateur table" ON public.utilisateur;
CREATE POLICY "Admin only access to utilisateur table" 
ON public.utilisateur 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can manage product offers" ON public.produit_offer;
CREATE POLICY "Admins can manage product offers" 
ON public.produit_offer 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can update orders" ON public.commande;
CREATE POLICY "Admins can update orders" 
ON public.commande 
FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can view all orders" ON public.commande;
CREATE POLICY "Admins can view all orders" 
ON public.commande 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can view all order details" ON public.commande_details;
CREATE POLICY "Admins can view all order details" 
ON public.commande_details 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
CREATE POLICY "Admins can update all orders" 
ON public.orders 
FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can delete products" ON public.produit;
CREATE POLICY "Admins can delete products" 
ON public.produit 
FOR DELETE 
USING (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can insert products" ON public.produit;
CREATE POLICY "Admins can insert products" 
ON public.produit 
FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can update products" ON public.produit;
CREATE POLICY "Admins can update products" 
ON public.produit 
FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can view all products" ON public.produit;
CREATE POLICY "Admins can view all products" 
ON public.produit 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can insert audit logs" ON public.admin_audit;
CREATE POLICY "Admins can insert audit logs" 
ON public.admin_audit 
FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit;
CREATE POLICY "Admins can view audit logs" 
ON public.admin_audit 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');