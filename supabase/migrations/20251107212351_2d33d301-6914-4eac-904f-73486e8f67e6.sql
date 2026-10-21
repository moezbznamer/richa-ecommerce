-- Create images_produit table for storing multiple product images with colors
CREATE TABLE IF NOT EXISTS public.images_produit (
  id bigserial PRIMARY KEY,
  id_produit bigint NOT NULL,
  color text NOT NULL,
  image_url text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add foreign key constraint
ALTER TABLE public.images_produit
ADD CONSTRAINT fk_images_produit_produit 
FOREIGN KEY (id_produit) 
REFERENCES public.produit(id_produit) 
ON DELETE CASCADE;

-- Create index for faster queries
CREATE INDEX idx_images_produit_id_produit ON public.images_produit(id_produit);
CREATE INDEX idx_images_produit_color ON public.images_produit(color);

-- Enable Row Level Security
ALTER TABLE public.images_produit ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view product images"
ON public.images_produit
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage product images"
ON public.images_produit
FOR ALL
USING (is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER set_images_produit_updated_at
  BEFORE UPDATE ON public.images_produit
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Add some comments for documentation
COMMENT ON TABLE public.images_produit IS 'Stores multiple images for products with different colors';
COMMENT ON COLUMN public.images_produit.id_produit IS 'Foreign key to produit table';
COMMENT ON COLUMN public.images_produit.color IS 'Color name for this image variant';
COMMENT ON COLUMN public.images_produit.image_url IS 'URL or path to the product image';