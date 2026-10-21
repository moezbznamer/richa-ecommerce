-- First, add UNIQUE constraint on email in utilisateur table
ALTER TABLE public.utilisateur ADD CONSTRAINT utilisateur_email_unique UNIQUE (email);

-- Create a function to handle new user creation in the utilisateur table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.utilisateur (email, mot_de_passe, nom, prenom, date_creation_compte)
  VALUES (
    NEW.email,
    'supabase_auth',
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    NOW()
  )
  ON CONFLICT (email) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create a trigger to automatically create utilisateur record on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Also insert all existing auth users who don't have a utilisateur record
INSERT INTO public.utilisateur (email, mot_de_passe, nom, prenom, date_creation_compte)
SELECT 
  email,
  'supabase_auth',
  COALESCE(raw_user_meta_data->>'last_name', ''),
  COALESCE(raw_user_meta_data->>'first_name', ''),
  created_at
FROM auth.users
WHERE email NOT IN (SELECT email FROM public.utilisateur)
ON CONFLICT (email) DO NOTHING;