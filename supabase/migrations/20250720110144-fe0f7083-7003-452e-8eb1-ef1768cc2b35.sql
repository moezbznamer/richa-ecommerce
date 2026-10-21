-- Create storage bucket for custom design uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('custom-designs', 'custom-designs', false);

-- Create policies for custom design uploads
CREATE POLICY "Users can upload their own design files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'custom-designs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own design files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'custom-designs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create table for custom design requests
CREATE TABLE public.custom_design_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  phone_number TEXT,
  design_concept TEXT NOT NULL,
  fabric_preference TEXT,
  fit_description TEXT,
  size_preference TEXT,
  color_preferences TEXT,
  special_instructions TEXT,
  uploaded_files TEXT[], -- Array of file URLs
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_design_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for custom design requests
CREATE POLICY "Users can create their own design requests" 
ON public.custom_design_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own design requests" 
ON public.custom_design_requests 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_custom_design_requests_updated_at
BEFORE UPDATE ON public.custom_design_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();