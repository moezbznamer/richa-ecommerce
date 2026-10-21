-- Create niveau table to track client levels
CREATE TABLE public.niveau (
    id_client SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    montant_spent NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (montant_spent >= 0),
    niveau INTEGER NOT NULL DEFAULT 1 CHECK (niveau >= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.niveau ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can manage all niveau records" 
ON public.niveau 
FOR ALL 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Users can view their own niveau record" 
ON public.niveau 
FOR SELECT 
USING (email = (auth.jwt() ->> 'email'));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_niveau_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_niveau_updated_at
    BEFORE UPDATE ON public.niveau
    FOR EACH ROW
    EXECUTE FUNCTION public.update_niveau_updated_at();

-- Create index on email for better performance
CREATE INDEX idx_niveau_email ON public.niveau(email);