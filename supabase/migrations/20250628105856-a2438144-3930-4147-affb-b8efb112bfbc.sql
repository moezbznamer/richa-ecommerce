
-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  first_name text,
  last_name text,
  phone text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$$;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add RLS policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Add more columns to products table for better filtering
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS gender varchar(20) DEFAULT 'unisex',
ADD COLUMN IF NOT EXISTS product_type varchar(50),
ADD COLUMN IF NOT EXISTS brand varchar(100),
ADD COLUMN IF NOT EXISTS rating decimal(2,1) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS reviews_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS discount_percentage integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS original_price numeric(10,2);

-- Create product_images table for multiple images per product
CREATE TABLE public.product_images (
  id serial PRIMARY KEY,
  product_id integer REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  is_primary boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Create product_sizes table for size options
CREATE TABLE public.product_sizes (
  id serial PRIMARY KEY,
  product_id integer REFERENCES public.products(id) ON DELETE CASCADE,
  size varchar(10) NOT NULL,
  stock_quantity integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies for new tables
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read product images and sizes
CREATE POLICY "Anyone can view product images" 
  ON public.product_images FOR SELECT 
  TO public USING (true);

CREATE POLICY "Anyone can view product sizes" 
  ON public.product_sizes FOR SELECT 
  TO public USING (true);

-- Insert sample data for better testing
INSERT INTO public.categories (name, description) VALUES 
('T-Shirts', 'Casual and formal t-shirts'),
('Jeans', 'Denim jeans for all occasions'),
('Jackets', 'Outerwear and jackets'),
('Shoes', 'Footwear collection'),
('Accessories', 'Fashion accessories')
ON CONFLICT (name) DO NOTHING;

-- Update existing products with new fields
UPDATE public.products SET 
  gender = CASE 
    WHEN id % 4 = 0 THEN 'man'
    WHEN id % 4 = 1 THEN 'woman' 
    WHEN id % 4 = 2 THEN 'boy'
    ELSE 'girl'
  END,
  product_type = CASE 
    WHEN id % 5 = 0 THEN 'T-Shirts'
    WHEN id % 5 = 1 THEN 'Jeans'
    WHEN id % 5 = 2 THEN 'Jackets'
    WHEN id % 5 = 3 THEN 'Shoes'
    ELSE 'Accessories'
  END,
  brand = 'RICHA',
  rating = 4.0 + (random() * 1.0),
  reviews_count = floor(random() * 200) + 10,
  is_featured = (id % 3 = 0),
  discount_percentage = CASE WHEN random() > 0.7 THEN floor(random() * 30) + 10 ELSE 0 END
WHERE gender IS NULL OR gender = '';

-- Update original_price based on discount
UPDATE public.products SET 
  original_price = CASE 
    WHEN discount_percentage > 0 THEN price / (1 - discount_percentage::decimal / 100)
    ELSE price
  END
WHERE original_price IS NULL;
