-- Add total_spent column to utilisateur table
ALTER TABLE public.utilisateur 
ADD COLUMN total_spent NUMERIC(10,2) DEFAULT 0.00 NOT NULL;

-- Create function to update user total spent when order status changes
CREATE OR REPLACE FUNCTION public.update_user_total_spent()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT (new order)
    IF TG_OP = 'INSERT' THEN
        IF NEW.statut = 'validee' THEN
            UPDATE public.utilisateur 
            SET total_spent = total_spent + NEW.total
            WHERE id_utilisateur = NEW.id_utilisateur;
        END IF;
        RETURN NEW;
    END IF;
    
    -- Handle UPDATE (status change)
    IF TG_OP = 'UPDATE' THEN
        -- Order was validated
        IF OLD.statut != 'validee' AND NEW.statut = 'validee' THEN
            UPDATE public.utilisateur 
            SET total_spent = total_spent + NEW.total
            WHERE id_utilisateur = NEW.id_utilisateur;
        -- Order was cancelled from validated state
        ELSIF OLD.statut = 'validee' AND NEW.statut != 'validee' THEN
            UPDATE public.utilisateur 
            SET total_spent = GREATEST(0, total_spent - OLD.total)
            WHERE id_utilisateur = NEW.id_utilisateur;
        END IF;
        RETURN NEW;
    END IF;
    
    -- Handle DELETE (order cancelled/deleted)
    IF TG_OP = 'DELETE' THEN
        IF OLD.statut = 'validee' THEN
            UPDATE public.utilisateur 
            SET total_spent = GREATEST(0, total_spent - OLD.total)
            WHERE id_utilisateur = OLD.id_utilisateur;
        END IF;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers
CREATE TRIGGER trigger_update_user_total_spent
    AFTER INSERT OR UPDATE OR DELETE ON public.commande
    FOR EACH ROW EXECUTE FUNCTION public.update_user_total_spent();

-- Function to get user level info
CREATE OR REPLACE FUNCTION public.get_user_level_info(user_email TEXT)
RETURNS TABLE (
    total_spent NUMERIC,
    current_level INTEGER,
    progress_percentage NUMERIC,
    next_milestone NUMERIC,
    badge_name TEXT
) AS $$
DECLARE
    user_total NUMERIC;
    level_num INTEGER;
    progress NUMERIC;
    next_target NUMERIC;
    badge TEXT;
BEGIN
    -- Get user's total spent
    SELECT u.total_spent INTO user_total
    FROM public.utilisateur u
    WHERE u.email = user_email;
    
    IF user_total IS NULL THEN
        user_total := 0;
    END IF;
    
    -- Calculate level (1 level per 100 DT)
    level_num := FLOOR(user_total / 100) + 1;
    
    -- Calculate next milestone
    next_target := CEIL(user_total / 100) * 100;
    IF user_total = next_target THEN
        next_target := next_target + 100;
    END IF;
    
    -- Calculate progress percentage to next level
    IF level_num = 1 THEN
        progress := (user_total / 100) * 100;
    ELSE
        progress := ((user_total - ((level_num - 1) * 100)) / 100) * 100;
    END IF;
    
    -- Determine badge
    IF user_total >= 300 THEN
        badge := 'Gold';
    ELSIF user_total >= 200 THEN
        badge := 'Silver';
    ELSIF user_total >= 100 THEN
        badge := 'Bronze';
    ELSE
        badge := 'None';
    END IF;
    
    RETURN QUERY SELECT user_total, level_num, progress, next_target, badge;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;