-- Create a trigger to automatically create a user in utilisateur table when a profile is created
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into utilisateur table when a profile is created
  INSERT INTO public.utilisateur (email, nom, prenom, mot_de_passe)
  VALUES (
    NEW.email,
    NEW.last_name,
    NEW.first_name,
    'temp_password' -- Temporary password as auth is handled by Supabase Auth
  )
  ON CONFLICT (email) DO NOTHING; -- Avoid duplicates
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();

-- Also create a function to sync existing profiles to utilisateur table
CREATE OR REPLACE FUNCTION public.sync_profiles_to_utilisateur()
RETURNS void AS $$
BEGIN
  INSERT INTO public.utilisateur (email, nom, prenom, mot_de_passe)
  SELECT 
    p.email,
    p.last_name,
    p.first_name,
    'temp_password'
  FROM public.profiles p
  LEFT JOIN public.utilisateur u ON p.email = u.email
  WHERE u.email IS NULL AND p.email IS NOT NULL
  ON CONFLICT (email) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Run the sync function to sync existing profiles
SELECT public.sync_profiles_to_utilisateur();