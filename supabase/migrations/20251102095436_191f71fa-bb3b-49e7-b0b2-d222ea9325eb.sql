-- Create custom_design_requests table for custom design orders
CREATE TABLE IF NOT EXISTS public.custom_design_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  phone_number text,
  design_concept text NOT NULL,
  fabric_preference text,
  fit_description text,
  size_preference text,
  color_preferences text,
  special_instructions text,
  uploaded_files text[],
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.custom_design_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their own design requests
CREATE POLICY "Anyone can create design requests"
ON public.custom_design_requests
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Users can view their own design requests
CREATE POLICY "Users can view own design requests"
ON public.custom_design_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at_custom_design_requests
  BEFORE UPDATE ON public.custom_design_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Create storage bucket for custom design files
INSERT INTO storage.buckets (id, name, public)
VALUES ('custom-designs', 'custom-designs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for custom-designs bucket
CREATE POLICY "Users can upload their own design files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'custom-designs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own design files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'custom-designs' AND auth.uid()::text = (storage.foldername(name))[1]);