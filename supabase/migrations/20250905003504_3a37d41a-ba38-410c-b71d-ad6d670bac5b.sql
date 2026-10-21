-- Function to simulate spending changes for testing
CREATE OR REPLACE FUNCTION public.simulate_spending_change(user_email TEXT, amount_change NUMERIC)
RETURNS TABLE (
    total_spent NUMERIC,
    current_level INTEGER,
    progress_percentage NUMERIC,
    next_milestone NUMERIC,
    badge_name TEXT
) AS $$
BEGIN
    -- Update user's total_spent
    UPDATE public.utilisateur 
    SET total_spent = GREATEST(0, total_spent + amount_change)
    WHERE email = user_email;
    
    -- Return updated level info
    RETURN QUERY SELECT * FROM public.get_user_level_info(user_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;