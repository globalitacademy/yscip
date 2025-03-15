
import { User, UserRole } from '@/types/user';
import { PendingUser, DemoAccount } from '@/types/auth';
import { mockUsers } from '@/data/mockUsers';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useAuthOperations = (
  user: User | null,
  pendingUsers: PendingUser[],
  demoAccounts: DemoAccount[] | undefined,
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void,
  setPendingUsers: React.Dispatch<React.SetStateAction<PendingUser[]>>,
  setDemoAccounts: React.Dispatch<React.SetStateAction<DemoAccount[]>>
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
  
  const registerUser = async (userData: Partial<User> & { password: string }): Promise<{success: boolean, token?: string}> => {
    // First try with Supabase
    try {
      // Check if it's a demo account email
      const isDemoAccount = demoAccounts?.some(
        account => account.email.toLowerCase() === userData.email?.toLowerCase()
      );
      
      if (isDemoAccount) {
        toast.error('Այս էլ․ հասցեն արդեն գրանցված է որպես դեմո հաշիվ');
        return { success: false };
      }
      
      // Try to sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'student'
          }
        }
      });
      
      if (!error && data.user) {
        console.log('Supabase registration successful');
        
        // Note: The user profile will be created through DB trigger
        
        toast.success('Գրանցումը հաջողված է, խնդրում ենք ստուգել Ձեր էլ․ փոստը հաստատման համար');
        return { success: true };
      } else if (error) {
        console.error('Supabase registration error:', error);
        // Now fallback to local registration
      }
    } catch (e) {
      console.error('Exception in Supabase registration:', e);
    }
    
    // Local registration process (fallback)
    const existingPendingUser = pendingUsers.find(
      u => u.email?.toLowerCase() === userData.email?.toLowerCase()
    );
    
    if (existingPendingUser) {
      toast.error('Այս էլ․ հասցեն արդեն գրանցված է');
      return { success: false };
    }
    
    // Generate a verification token
    const verificationToken = uuidv4();
    
    // Create a new pending user
    const newPendingUser: PendingUser = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'student',
      password: userData.password,
      department: userData.department,
      verificationToken,
      verified: false
    };
    
    setPendingUsers(prev => [...prev, newPendingUser]);
    console.log(`Verification token generated for ${userData.email}: ${verificationToken}`);
    console.log(`Verification link: ${window.location.origin}/verify-email?token=${verificationToken}`);
    
    toast.success('Գրանցումը հաջողված է, խնդրում ենք ստուգել Ձեր էլ․ փոստը հաստատման համար');
    return { success: true, token: verificationToken };
  };

  const manageDemoAccount = async (account: DemoAccount, action: 'add' | 'update' | 'delete'): Promise<boolean> => {
    if (!demoAccounts) return false;
    
    try {
      let updatedAccounts: DemoAccount[] = [...demoAccounts];
      
      switch (action) {
        case 'add':
          // Check if account with same email already exists
          if (updatedAccounts.some(a => a.email.toLowerCase() === account.email.toLowerCase())) {
            toast.error('Այս էլ․ հասցեով դեմո հաշիվն արդեն գոյություն ունի');
            return false;
          }
          
          // Generate ID if not provided
          if (!account.id) {
            account.id = uuidv4();
          }
          
          updatedAccounts.push(account);
          toast.success(`Դեմո հաշիվը հաջողությամբ ավելացվել է՝ ${account.name}`);
          break;
          
        case 'update':
          // Find the index of the account to update
          const updateIndex = updatedAccounts.findIndex(a => a.id === account.id);
          
          if (updateIndex === -1) {
            toast.error('Դեմո հաշիվը չի գտնվել');
            return false;
          }
          
          // Check if trying to update to an email that already exists
          const duplicateEmailIndex = updatedAccounts.findIndex(
            a => a.id !== account.id && a.email.toLowerCase() === account.email.toLowerCase()
          );
          
          if (duplicateEmailIndex !== -1) {
            toast.error('Այս էլ․ հասցեն արդեն օգտագործվում է այլ դեմո հաշվի կողմից');
            return false;
          }
          
          updatedAccounts[updateIndex] = account;
          toast.success(`Դեմո հաշիվը հաջողությամբ թարմացվել է՝ ${account.name}`);
          break;
          
        case 'delete':
          // Filter out the account to delete
          updatedAccounts = updatedAccounts.filter(a => a.id !== account.id);
          toast.success(`Դեմո հաշիվը հաջողությամբ ջնջվել է`);
          break;
      }
      
      // Update state and localStorage
      setDemoAccounts(updatedAccounts);
      localStorage.setItem('demoAccounts', JSON.stringify(updatedAccounts));
      
      return true;
    } catch (error) {
      console.error(`Error ${action}ing demo account:`, error);
      toast.error(`Սխալ դեմո հաշիվը ${action === 'add' ? 'ավելացնելիս' : action === 'update' ? 'թարմացնելիս' : 'ջնջելիս'}`);
      return false;
    }
  };

  return {
    login,
    logout,
    registerUser,
    manageDemoAccount
  };
};
