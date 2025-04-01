
import { User, UserRole } from '@/types/user';
import { PendingUser } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleFallbackLogin } from '@/utils/authUtils';
import { mainAdminUser } from '../mockAdminUsers';

export const executeLogin = async (
  email: string,
  password: string,
  pendingUsers: PendingUser[],
  mockUsers: User[],
  setUser: (user: User | null) => void,
  setIsAuthenticated: (value: boolean) => void
): Promise<boolean> => {
  try {
    console.log('Attempting login with email:', email);
    
    // Special handling for main admin account
    if (email.toLowerCase() === 'gitedu@bk.ru' && password === 'Qolej2025*') {
      console.log('Login attempt for main admin, using direct access');
      // Direct login for main admin
      setUser(mainAdminUser);
      setIsAuthenticated(true);
      
      // Make sure admin data is stored with additional persistence indicator
      const adminData = {
        ...mainAdminUser,
        isPersistentAdmin: true  // Add a flag to identify this as a persistent admin session
      };
      localStorage.setItem('currentUser', JSON.stringify(adminData));
      
      // Try to activate admin account in background, but don't wait for it
      try {
        supabase.functions.invoke('ensure-admin-activation').catch(err => 
          console.error('Admin activation background error:', err)
        );
      } catch (error) {
        console.error('Error invoking admin activation function:', error);
      }
      
      toast.success('Մուտքը հաջողված է։ Բարի գալուստ, Ադմինիստրատոր։');
      return true;
    }
    
    // First try Supabase auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Supabase login error:', error);
      const fallbackResult = handleFallbackLogin(email, password, pendingUsers, mockUsers, setUser, setIsAuthenticated);
      
      if (fallbackResult) {
        toast.success('Մուտքը հաջողված է։');
      } else {
        toast.error('Սխալ էլ․ հասցե կամ գաղտնաբառ։');
      }
      
      return fallbackResult;
    }
    
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user data:', userError);
        const fallbackResult = handleFallbackLogin(email, password, pendingUsers, mockUsers, setUser, setIsAuthenticated);
        
        if (fallbackResult) {
          toast.success('Մուտքը հաջողված է։');
        }
        
        return fallbackResult;
      }
      
      if (!userData.registration_approved) {
        toast.error('Ձեր հաշիվը սպասում է ադմինիստրատորի հաստատման։');
        await supabase.auth.signOut();
        return false;
      }
      
      const loggedInUser: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role as UserRole,
        avatar: userData.avatar,
        department: userData.department,
        registrationApproved: userData.registration_approved,
        organization: userData.organization,
        group: userData.group_name // Note: mapping from group_name to group
      };
      
      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      console.log('Login successful for:', loggedInUser.email, loggedInUser.role);
      toast.success('Մուտքը հաջողված է։');
      return true;
    }
    
    toast.error('Սխալ էլ․ հասցե կամ գաղտնաբառ։');
    return false;
  } catch (error) {
    console.error('Login error:', error);
    const fallbackResult = handleFallbackLogin(email, password, pendingUsers, mockUsers, setUser, setIsAuthenticated);
    
    if (!fallbackResult) {
      toast.error('Սխալ էլ․ հասցե կամ գաղտնաբառ։');
    }
    
    return fallbackResult;
  }
};
