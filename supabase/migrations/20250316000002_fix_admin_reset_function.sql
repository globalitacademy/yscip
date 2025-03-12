
-- Update the reset_admin_account function to avoid the confirmed_at column error
CREATE OR REPLACE FUNCTION public.reset_admin_account()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  admin_email TEXT := 'gitedu@bk.ru';
  admin_password TEXT := 'Qolej2025*';
  admin_id uuid;
BEGIN
  -- Delete admin from auth.users which will cascade to public.users
  DELETE FROM auth.users WHERE email = admin_email;
  
  -- Just to be extra safe, clean up public.users directly too
  DELETE FROM public.users WHERE email = admin_email;
  
  -- Now call verify_designated_admin to re-create with proper settings
  PERFORM public.verify_designated_admin();
  
  -- Get the new admin ID for further operations
  SELECT id INTO admin_id FROM auth.users WHERE email = admin_email;
  
  -- Update the user account with proper settings (if needed)
  IF admin_id IS NOT NULL THEN
    -- Additional checks to ensure admin is properly set up
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
    
    -- Also ensure proper profile in public.users
    UPDATE public.users
    SET
      role = 'admin',
      registration_approved = true,
      name = 'Administrator',
      updated_at = NOW()
    WHERE id = admin_id;
  END IF;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error resetting admin account: %', SQLERRM;
    RETURN false;
END;
$$;
