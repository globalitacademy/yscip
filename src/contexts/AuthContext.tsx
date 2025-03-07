
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/data/userRoles';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (userData: Partial<User>) => Promise<{success: boolean, message?: string}>;
  verifyEmail: (token: string) => Promise<boolean>;
  approveRegistration: (userId: string) => Promise<boolean>;
  getPendingUsers: () => Promise<any[]>;
}

// AuthContext ստեղծում
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Օգտատիրոջ սեսիան ստուգելու համար
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setUser(null);
          setIsAuthenticated(false);
        } else if (data?.session) {
          // Ստանալ օգտատիրոջ տվյալները
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error('User data error:', userError);
            setUser(null);
            setIsAuthenticated(false);
          } else if (userData.user) {
            // Ձևավորել User օբյեկտը auth.users-ից ստացված տվյալներով
            const authUser: User = {
              id: userData.user.id,
              email: userData.user.email || '',
              name: userData.user.user_metadata?.name || 'User',
              role: (userData.user.user_metadata?.role as UserRole) || 'student',
              registrationApproved: userData.user.user_metadata?.registration_approved || false,
              avatar: userData.user.user_metadata?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.user.id}`,
              ...(userData.user.user_metadata?.organization ? { organization: userData.user.user_metadata.organization } : {}),
              ...(userData.user.user_metadata?.department ? { department: userData.user.user_metadata.department } : {})
            };
            
            setUser(authUser);
            setIsAuthenticated(true);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Ստուգել սեսիան սկզբից
    checkSession();

    // Սեսիաների փոփոխությունների հետևումը
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('User data error:', userError);
          setUser(null);
          setIsAuthenticated(false);
          return;
        }
        
        if (userData.user) {
          // Ստուգել արդյոք օգտատերը հաստատված է
          const isApproved = userData.user.user_metadata?.registration_approved || false;
          
          // Եթե հաստատված չէ և դերը ուսանողից բացի այլ է, ապա տեղեկացնել օգտատիրոջը
          if (!isApproved && userData.user.user_metadata?.role !== 'student') {
            toast.error('Ձեր հաշիվը սպասում է ադմինիստրատորի հաստատման։');
            await supabase.auth.signOut();
            setUser(null);
            setIsAuthenticated(false);
            return;
          }
          
          const authUser: User = {
            id: userData.user.id,
            email: userData.user.email || '',
            name: userData.user.user_metadata?.name || 'User',
            role: (userData.user.user_metadata?.role as UserRole) || 'student',
            registrationApproved: isApproved,
            avatar: userData.user.user_metadata?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.user.id}`,
            ...(userData.user.user_metadata?.organization ? { organization: userData.user.user_metadata.organization } : {}),
            ...(userData.user.user_metadata?.department ? { department: userData.user.user_metadata.department } : {})
          };
          
          setUser(authUser);
          setIsAuthenticated(true);
        }
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      // ավտոմատ կանչվում է addEventListener-ի remove-ը
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Մուտք գործելու ֆունկցիա
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      if (data?.user) {
        // Ստուգել արդյոք օգտատերը հաստատված է (եթե ուսանող չէ)
        const isApproved = data.user.user_metadata?.registration_approved || false;
        const role = data.user.user_metadata?.role || 'student';

        if (!isApproved && role !== 'student') {
          toast.error('Ձեր հաշիվը սպասում է ադմինիստրատորի հաստատման։');
          await supabase.auth.signOut();
          return false;
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Դուրս գալու ֆունկցիա
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Գրանցման ֆունկցիա
  const registerUser = async (userData: Partial<User>): Promise<{success: boolean, message?: string}> => {
    try {
      const { email, password, name, role, organization, department } = userData as {
        email?: string;
        password?: string;
        name?: string;
        role?: UserRole;
        organization?: string;
        department?: string;
      };

      if (!email || !password || !name || !role) {
        return { 
          success: false, 
          message: 'Բոլոր պարտադիր դաշտերը պետք է լրացվեն։' 
        };
      }

      // Ստուգել արդյոք օգտատերը արդեն գրանցված է
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (existingUser?.user) {
        return { 
          success: false, 
          message: 'Այս էլ․ հասցեն արդեն գրանցված է։' 
        };
      }

      // Մետա տվյալները ձևավորում
      const userMetadata: any = {
        name,
        role,
        registration_approved: role === 'student', // Ուսանողների համար ավտոմատ հաստատում
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
      };

      // Եթե նշված է կազմակերպությունը գործատուի համար
      if (role === 'employer' && organization) {
        userMetadata.organization = organization;
      }

      // Եթե նշված է ֆակուլտետը դասախոսի համար
      if ((role === 'lecturer' || role === 'project_manager') && department) {
        userMetadata.department = department;
      }

      // Գրանցում
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });

      if (error) {
        console.error('Registration error:', error);
        return { 
          success: false, 
          message: error.message 
        };
      }

      if (data?.user) {
        const needsApproval = ['lecturer', 'employer', 'project_manager', 'supervisor'].includes(role);
        
        toast.success(
          `Գրանցման հայտն ընդունված է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը՝ հաշիվը ակտիվացնելու համար։${
            needsApproval ? ' Ակտիվացումից հետո Ձեր հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից։' : ''
          }`
        );
        
        return { success: true };
      }

      return { 
        success: false, 
        message: 'Սխալ գրանցման ընթացքում։ Խնդրում ենք փորձել կրկին։' 
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Գրանցման սխալ' 
      };
    }
  };

  // Էլ․ հասցեի հաստատման ֆունկցիա
  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      // Supabase-ն ավտոմատ կհաստատի էլ․ հասցեն վերադարձման URL-ի միջոցով
      return true;
    } catch (error) {
      console.error('Email verification error:', error);
      return false;
    }
  };

  // Գրանցման հաստատման ֆունկցիա ադմինիստրատորի համար
  const approveRegistration = async (userId: string): Promise<boolean> => {
    try {
      // Ստուգել արդյոք ընթացիկ օգտատերը ադմին է
      if (!user || user.role !== 'admin') {
        toast.error('Միայն ադմինիստրատորը կարող է հաստատել գրանցումները։');
        return false;
      }

      // Ստանալ օգտատիրոջ տվյալները
      const { data, error } = await supabase.auth.admin.getUserById(userId);

      if (error) {
        console.error('Get user error:', error);
        return false;
      }

      if (!data.user) {
        toast.error('Օգտատերը չի գտնվել։');
        return false;
      }

      // Թարմացնել օգտատիրոջ մետա տվյալները
      const userMetadata = {
        ...data.user.user_metadata,
        registration_approved: true
      };

      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: userMetadata }
      );

      if (updateError) {
        console.error('Update user error:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Approve registration error:', error);
      return false;
    }
  };

  // Ստանալ հաստատման սպասող օգտատերերին
  const getPendingUsers = async (): Promise<any[]> => {
    try {
      // Ստուգել արդյոք ընթացիկ օգտատերը ադմին է
      if (!user || user.role !== 'admin') {
        return [];
      }

      // Այստեղ պետք է լինի հարցում, որը կվերադարձնի բոլոր հաստատման սպասող օգտատերերին
      // Քանի որ Supabase-ը չի տրամադրում API բոլոր օգտատերերին ստանալու համար, 
      // այս ֆունկցիոնալությունը պետք է իրականացվի օգտագործելով այլ աղյուսակ,
      // որտեղ կպահվեն օգտատերերի տվյալները
      
      // Ժամանակավոր լուծում՝ վերադարձնել դատարկ զանգված
      return [];
    } catch (error) {
      console.error('Get pending users error:', error);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        registerUser,
        verifyEmail,
        approveRegistration,
        getPendingUsers
      }}
    >
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
