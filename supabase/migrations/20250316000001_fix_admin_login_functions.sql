
-- Fix the admin login verification function to avoid updating the confirmed_at column
CREATE OR REPLACE FUNCTION public.verify_designated_admin()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  admin_id uuid;
BEGIN
  -- First ensure the admin user exists in auth.users
  UPDATE auth.users 
  SET 
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    updated_at = NOW(),
    is_sso_user = false,
    role = 'authenticated',
    -- Add raw_user_meta_data for additional information
    raw_user_meta_data = jsonb_build_object(
      'name', 'Administrator',
      'role', 'admin',
      'email_confirmed', true
    )
  WHERE email = 'gitedu@bk.ru'
  RETURNING id INTO admin_id;
  
  IF admin_id IS NULL THEN
    INSERT INTO auth.users (
      email,
      email_confirmed_at,
      created_at,
      updated_at,
      is_sso_user,
      role,
      raw_user_meta_data
    )
    VALUES (
      'gitedu@bk.ru',
      NOW(),
      NOW(),
      NOW(),
      false,
      'authenticated',
      jsonb_build_object(
        'name', 'Administrator',
        'role', 'admin',
        'email_confirmed', true
      )
    )
    RETURNING id INTO admin_id;
  END IF;
    
  -- Then ensure admin exists in public.users with correct role
  IF EXISTS (SELECT 1 FROM public.users WHERE id = admin_id) THEN
    UPDATE public.users 
    SET 
      role = 'admin',
      registration_approved = true,
      updated_at = NOW(),
      name = 'Administrator'
    WHERE id = admin_id;
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
      admin_id,
      'gitedu@bk.ru',
      'Administrator',
      'admin',
      true,
      NOW(),
      NOW()
    );
  END IF;
END;
$$;

-- Fix the ensure_admin_login function to avoid updating the confirmed_at column
CREATE OR REPLACE FUNCTION public.ensure_admin_login()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  admin_email TEXT := 'gitedu@bk.ru';
  admin_id uuid;
BEGIN
  -- First verify the admin account
  PERFORM public.verify_designated_admin();
  
  -- Get admin ID
  SELECT id INTO admin_id FROM auth.users WHERE email = admin_email;
  
  -- Ensure confirmed status is set
  IF admin_id IS NOT NULL THEN
    UPDATE auth.users
    SET 
      email_confirmed_at = NOW(),
      updated_at = NOW(),
      raw_user_meta_data = jsonb_build_object(
        'name', 'Administrator',
        'role', 'admin',
        'email_confirmed', true
      )
    WHERE id = admin_id;
    
    -- Ensure the public profile is updated
    UPDATE public.users
    SET
      registration_approved = true,
      role = 'admin'
    WHERE id = admin_id;
    
    RETURN true;
  END IF;
  
  RETURN false;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error ensuring admin login: %', SQLERRM;
    RETURN false;
END;
$$;

-- Update the trigger function to avoid updating the confirmed_at column
CREATE OR REPLACE FUNCTION public.ensure_admin_confirmed()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
BEGIN
  -- Check if this is the admin email
  IF LOWER(NEW.email) = 'gitedu@bk.ru' THEN
    -- Set the confirmation date
    NEW.email_confirmed_at := NOW();
    
    -- Update user metadata
    NEW.raw_user_meta_data := jsonb_build_object(
      'name', 'Administrator',
      'role', 'admin',
      'email_confirmed', true
    );
  END IF;
  RETURN NEW;
END;
$$;
