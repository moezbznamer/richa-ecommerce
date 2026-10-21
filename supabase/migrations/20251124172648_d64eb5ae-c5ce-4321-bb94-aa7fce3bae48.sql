-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Users can view own design requests" ON public.custom_design_requests;

-- Create updated SELECT policy that allows owners and admins
CREATE POLICY "Users can view own design requests" 
ON public.custom_design_requests 
FOR SELECT 
USING (auth.uid() = user_id OR is_admin(auth.uid()));