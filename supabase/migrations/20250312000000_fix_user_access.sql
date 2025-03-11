
-- Function to get user by ID without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_by_id(user_id UUID)
RETURNS SETOF public.users
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.users
  WHERE id = user_id;
END;
$$;

-- Function to check user approval without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.check_user_approval(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
  is_approved boolean;
BEGIN
  SELECT role, registration_approved INTO user_role, is_approved
  FROM public.users
  WHERE id = user_id;
  
  -- Students are automatically approved, others need approval
  RETURN user_role = 'student' OR is_approved = true;
END;
$$;
