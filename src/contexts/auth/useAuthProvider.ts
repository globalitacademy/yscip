
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';
import { toast } from 'sonner';

export function useAuthProvider() {
  const [user, setUser] = useState<DBUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial session check and user data fetch
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
            setIsAuthenticated(false);
          } else {
            setUser(userData as DBUser);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          setIsAuthenticated(false);
        } else {
          setUser(userData as DBUser);
          setIsAuthenticated(true);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        toast.error('Մուտքը չի հաջողվել: ' + error.message);
        return false;
      }
      
      if (!data.session) {
        toast.error('Մուտքը չի հաջողվել');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error('Տեղի ունեցավ անսպասելի սխալ');
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  const registerUser = async (userData: Partial<DBUser> & { password: string }): Promise<boolean> => {
    try {
      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single();
      
      if (existingUser) {
        toast.error(`Այս էլ․ հասցեն արդեն գրանցված է։`);
        return false;
      }
      
      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is expected
        console.error('Error checking email:', checkError);
        toast.error('Տեղի ունեցավ սխալ օգտատիրոջ տվյալները ստուգելիս։');
        return false;
      }

      // Check if this is the first admin account
      let isFirstAdmin = false;
      if (userData.role === 'admin') {
        const { data: existingAdmins, error: adminCheckError } = await supabase
          .from('users')
          .select('id')
          .eq('role', 'admin')
          .limit(1);
        
        if (!adminCheckError && (!existingAdmins || existingAdmins.length === 0)) {
          isFirstAdmin = true;
        }
      }
      
      // Register with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email!,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role
          }
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        toast.error('Գրանցումը չի հաջողվել: ' + error.message);
        return false;
      }

      // If this is the first admin, automatically approve them
      if (isFirstAdmin) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ registration_approved: true })
          .eq('email', userData.email!);
        
        if (updateError) {
          console.error('Error approving first admin:', updateError);
        } else {
          toast.success('Դուք գրանցվել եք որպես առաջին ադմինիստրատոր և ձեր հաշիվը ավտոմատ հաստատվել է։');
          return true;
        }
      }
      
      const needsApproval = ['lecturer', 'employer', 'project_manager', 'supervisor', 'admin'].includes(userData.role as string);
      
      toast.success(
        `Գրանցման հայտն ընդունված է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը՝ հաշիվը ակտիվացնելու համար։${
          needsApproval && !isFirstAdmin ? ' Ակտիվացումից հետո Ձեր հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից։' : ''
        }`
      );
      
      return true;
    } catch (error) {
      console.error('Unexpected registration error:', error);
      toast.error('Տեղի ունեցավ անսպասելի սխալ');
      return false;
    }
  };

  const sendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) {
        console.error('Error resending confirmation email:', error);
        toast.error('Հաստատման հղումը չի ուղարկվել: ' + error.message);
        return false;
      }
      
      toast.success('Հաստատման հղումը կրկին ուղարկված է Ձեր էլ․ փոստին։');
      return true;
    } catch (error) {
      console.error('Unexpected error sending verification email:', error);
      toast.error('Տեղի ունեցավ անսպասելի սխալ');
      return false;
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      // In a real implementation, this would verify the token with Supabase
      // For now, we'll just return true as Supabase handles email verification internally
      return true;
    } catch (error) {
      console.error('Error verifying email:', error);
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    registerUser,
    sendVerificationEmail,
    verifyEmail
  };
}
