-- Enable RLS on all tables
ALTER TABLE public.utilisateur ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panier ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commande ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commande_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.niveau ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produit_offer ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historique_achat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = is_admin.user_id
  );
$$;

-- Create function to get user's utilisateur id from auth.uid()
CREATE OR REPLACE FUNCTION public.get_utilisateur_id()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id_utilisateur
  FROM public.utilisateur u
  JOIN auth.users au ON au.email = u.email
  WHERE au.id = auth.uid()
  LIMIT 1;
$$;

-- Profiles policies (users can view/update their own profile)
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Utilisateur policies
CREATE POLICY "Users can view own data"
ON public.utilisateur FOR SELECT
TO authenticated
USING (
  id_utilisateur = public.get_utilisateur_id() OR
  public.is_admin(auth.uid())
);

CREATE POLICY "Users can update own data"
ON public.utilisateur FOR UPDATE
TO authenticated
USING (id_utilisateur = public.get_utilisateur_id());

CREATE POLICY "Admins can manage users"
ON public.utilisateur FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- Produit policies (public read, admin write)
CREATE POLICY "Anyone can view products"
ON public.produit FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage products"
ON public.produit FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- Produit offer policies (public read, admin write)
CREATE POLICY "Anyone can view offers"
ON public.produit_offer FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage offers"
ON public.produit_offer FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- Panier policies (users can only access their own cart)
CREATE POLICY "Users can view own cart"
ON public.panier FOR SELECT
TO authenticated
USING (id_utilisateur = public.get_utilisateur_id());

CREATE POLICY "Users can insert to own cart"
ON public.panier FOR INSERT
TO authenticated
WITH CHECK (id_utilisateur = public.get_utilisateur_id());

CREATE POLICY "Users can update own cart"
ON public.panier FOR UPDATE
TO authenticated
USING (id_utilisateur = public.get_utilisateur_id());

CREATE POLICY "Users can delete from own cart"
ON public.panier FOR DELETE
TO authenticated
USING (id_utilisateur = public.get_utilisateur_id());

-- Commande policies (users can only access their own orders)
CREATE POLICY "Users can view own orders"
ON public.commande FOR SELECT
TO authenticated
USING (
  id_utilisateur = public.get_utilisateur_id() OR
  public.is_admin(auth.uid())
);

CREATE POLICY "Users can create own orders"
ON public.commande FOR INSERT
TO authenticated
WITH CHECK (id_utilisateur = public.get_utilisateur_id());

CREATE POLICY "Admins can update orders"
ON public.commande FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can delete own pending orders"
ON public.commande FOR DELETE
TO authenticated
USING (
  id_utilisateur = public.get_utilisateur_id() AND
  statut IN ('en attente', 'pending')
);

-- Commande details policies
CREATE POLICY "Users can view own order details"
ON public.commande_details FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.commande
    WHERE commande.id_commande = commande_details.id_commande
    AND (commande.id_utilisateur = public.get_utilisateur_id() OR public.is_admin(auth.uid()))
  )
);

CREATE POLICY "Users can insert order details"
ON public.commande_details FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.commande
    WHERE commande.id_commande = commande_details.id_commande
    AND commande.id_utilisateur = public.get_utilisateur_id()
  )
);

CREATE POLICY "Users can delete own order details"
ON public.commande_details FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.commande
    WHERE commande.id_commande = commande_details.id_commande
    AND commande.id_utilisateur = public.get_utilisateur_id()
    AND commande.statut IN ('en attente', 'pending')
  )
);

-- Niveau policies (users can view own level, admins can manage)
CREATE POLICY "Users can view own level"
ON public.niveau FOR SELECT
TO authenticated
USING (
  email IN (
    SELECT au.email FROM auth.users au WHERE au.id = auth.uid()
  ) OR public.is_admin(auth.uid())
);

CREATE POLICY "System can update levels"
ON public.niveau FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- Orders table policies
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can create orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Historique achat policies
CREATE POLICY "Users can view own purchase history"
ON public.historique_achat FOR SELECT
TO authenticated
USING (
  id_utilisateur = public.get_utilisateur_id() OR
  public.is_admin(auth.uid())
);

-- Admin users policies (only admins can view/manage)
CREATE POLICY "Admins can view admin users"
ON public.admin_users FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage admin users"
ON public.admin_users FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin audit policies (only admins can view)
CREATE POLICY "Admins can view audit logs"
ON public.admin_audit FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert audit logs"
ON public.admin_audit FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));