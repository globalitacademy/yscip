
import { User, UserRole } from '@/types/user';
import { PendingUser, DemoAccount } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useLoginOperations = (
  pendingUsers: PendingUser[],
  demoAccounts: DemoAccount[] | undefined,
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void
) => {
  const login = async (email: string, password: string): Promise<boolean> => {
    // First try Supabase login
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Supabase login error:', error);
        // Fall back to mock login
      } else if (data.user) {
        console.log('Supabase login successful:', data.user);
        // Fetch the user profile data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (userData && !userError) {
          // Map to our User type
          const authUser: User = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            department: userData.department || '',
            avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.id}`,
            course: userData.course,
            group: userData.group_name,
            organization: userData.organization,
            registrationApproved: userData.registration_approved
          };
          
          setUser(authUser);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(authUser));
          
          toast.success(`Բարի գալուստ, ${authUser.name}`);
          return true;
        } else {
          console.error('Error fetching user data:', userError);
        }
      }
    } catch (e) {
      console.error('Exception in Supabase login:', e);
    }
    
    // Try mock login
    if (demoAccounts?.length) {
      const demoAccount = demoAccounts.find(
        account => account.email.toLowerCase() === email.toLowerCase() && account.password === password
      );
      
      if (demoAccount) {
        // Find the full user data from mockUsers
        const mockUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (mockUser) {
          setUser(mockUser);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(mockUser));
          
          toast.success(`Բարի գալուստ, ${mockUser.name}`);
          return true;
        }
      }
    }
    
    // Also check pendingUsers for not-yet-approved accounts
    const pendingUser = pendingUsers.find(
      u => u.email?.toLowerCase() === email.toLowerCase() && 
           u.password === password && 
           u.verified
    );
    
    if (pendingUser) {
      if (pendingUser.registrationApproved) {
        const newUser: User = {
          id: pendingUser.id || uuidv4(),
          name: pendingUser.name || 'New User',
          email: pendingUser.email || '',
          role: pendingUser.role as UserRole || 'student',
          department: pendingUser.department || '',
          avatar: pendingUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pendingUser.id}`
        };
        
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        toast.success(`Բարի գալուստ, ${newUser.name}`);
        return true;
      } else {
        toast.error('Ձեր հաշիվը դեռ չի հաստատվել ադմինիստրատորի կողմից։');
        return false;
      }
    }
    
    toast.error('Սխալ էլ․ հասցե կամ գաղտնաբառ');
    return false;
  };

  const logout = async () => {
    try {
      // Try Supabase logout
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Error in Supabase logout:', e);
    }
    
    // Local logout
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    toast.success('Դուք հաջողությամբ դուրս եք եկել համակարգից');
  };

  return {
    login,
    logout
  };
};

// Import for demo account login functionality
import { mockUsers } from '@/data/mockUsers';
