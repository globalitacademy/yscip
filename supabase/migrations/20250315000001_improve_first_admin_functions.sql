
-- Improved function to check if this is the first admin
CREATE OR REPLACE FUNCTION public.get_first_admin_status()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE role = 'admin'
  ) INTO admin_exists;
  
  RETURN NOT admin_exists; -- Return true if no admin exists (this is first admin)
END;
$$;

-- Improved function to approve the first admin with full access
CREATE OR REPLACE FUNCTION public.approve_first_admin(admin_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_first_admin boolean;
  user_id uuid;
BEGIN
  -- Check if this is the first admin
  SELECT public.get_first_admin_status() INTO is_first_admin;
  
  -- If this is the first admin, approve them with full access
  IF is_first_admin THEN
    -- Get the user ID
    SELECT id INTO user_id FROM auth.users WHERE email = admin_email;
    
    -- If user exists in auth.users
    IF user_id IS NOT NULL THEN
      -- Ensure email is confirmed in auth
      UPDATE auth.users
      SET 
        email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
        confirmed_at = COALESCE(confirmed_at, NOW()),
        updated_at = NOW(),
        raw_user_meta_data = jsonb_build_object(
          'name', COALESCE(raw_user_meta_data->>'name', 'Administrator'),
          'role', 'admin',
          'email_confirmed', true
        )
      WHERE id = user_id;
      
      -- Update or insert in users table
      IF EXISTS (SELECT 1 FROM public.users WHERE id = user_id) THEN
        UPDATE public.users
        SET 
          role = 'admin', 
          registration_approved = true,
          updated_at = NOW()
        WHERE id = user_id;
      ELSE
        INSERT INTO public.users (
          id,
          email,
          name,
          role,
          registration_approved,
          created_at,
          updated_at
        )
        VALUES (
          user_id,
          admin_email,
          COALESCE((SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = user_id), 'Administrator'),
          'admin',
          true,
          NOW(),
          NOW()
        );
      END IF;
      
      RETURN true;
    END IF;
  END IF;
  
  RETURN false;
END;
$$;
