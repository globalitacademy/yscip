
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DBUser } from '@/types/database.types';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { RegisterUserData } from './types';
import { checkFirstAdmin, isDesignatedAdmin } from '@/contexts/auth/utils/sessionHelpers';
import { supabase } from '@/integrations/supabase/client';

const Login: React.FC = () => {
  const { login, registerUser, user, isAuthenticated, isApproved } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);
  const [designatedAdminMessage, setDesignatedAdminMessage] = useState(false);

  // Check if there are existing admins and check for designated admin in URL
  useEffect(() => {
    const checkExistingAdmins = async () => {
      const firstAdmin = await checkFirstAdmin();
      setIsFirstAdmin(firstAdmin);
    };
    
    // Check if we're returning from a password reset or verification link
    const checkParams = async () => {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.hash.substring(1));
      const email = params.get('email');
      const type = params.get('type');
      
      console.log('URL params check:', { email, type });
      
      if (email && email === 'gitedu@bk.ru') {
        setDesignatedAdminMessage(true);
        
        // If this is the designated admin, try to ensure their account is verified
        if (await isDesignatedAdmin(email)) {
          try {
            // Update user metadata 
            const { data, error } = await supabase.auth.updateUser({
              data: { email_confirmed: true }
            });
            
            if (error) {
              console.error('Error updating admin metadata:', error);
            } else {
              console.log('Successfully updated admin metadata', data);
            }
          } catch (err) {
            console.error('Unexpected error updating admin:', err);
          }
        }
      }
    };

    checkExistingAdmins();
    checkParams();
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (!isApproved && user.role !== 'student') {
        navigate('/approval-pending');
        return;
      }
      
      redirectToDashboard(user.role);
    }
  }, [isAuthenticated, user, isApproved, navigate]);

  const redirectToDashboard = (role: string) => {
    switch (role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'lecturer':
      case 'instructor':
        navigate('/courses');
        break;
      case 'project_manager':
      case 'supervisor':
        navigate('/projects/manage');
        break;
      case 'employer':
        navigate('/projects/my');
        break;
      case 'student':
        navigate('/projects');
        break;
      default:
        navigate('/');
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // Check if this is the designated admin
      const isAdmin = await isDesignatedAdmin(email);
      
      if (isAdmin) {
        // For the admin account, try to ensure their email is confirmed first
        try {
          const { data, error } = await supabase.auth.updateUser({
            data: { email_confirmed: true }
          });
          
          if (error) {
            console.error('Error updating admin metadata before login:', error);
          } else {
            console.log('Successfully updated admin metadata before login');
          }
        } catch (err) {
          console.error('Unexpected error updating admin before login:', err);
        }
      }
      
      // Normal login process
      const success = await login(email, password);
      if (success) {
        if (isAdmin) {
          toast.success('Մուտքն հաջողվել է', {
            description: 'Դուք հաջողությամբ մուտք եք գործել համակարգ որպես ադմինիստրատոր',
          });
        } else {
          toast.success('Մուտքն հաջողվել է', {
            description: 'Դուք հաջողությամբ մուտք եք գործել համակարգ',
          });
        }
        // No need to navigate here as the useEffect will handle redirection
      } else {
        toast.error('Մուտքը չի հաջողվել', {
          description: 'Էլ․ հասցեն կամ գաղտնաբառը սխալ է կամ Ձեր հաշիվը դեռ ակտիվացված չէ',
        });
      }
    } catch (error) {
      toast.error('Սխալ', {
        description: 'Տեղի ունեցավ անսպասելի սխալ',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData: RegisterUserData) => {
    setIsLoading(true);

    try {
      // Check if this is the designated admin
      const isAdmin = await isDesignatedAdmin(userData.email);
      
      if (isAdmin) {
        setDesignatedAdminMessage(true);
      }
      
      // Check if employer has organization
      if (userData.role === 'employer' && !userData.organization) {
        toast.error('Սխալ', {
          description: 'Կազմակերպության անունը պարտադիր է գործատուի համար',
        });
        setIsLoading(false);
        return;
      }

      const autoApprove = userData.role === 'student' || (userData.role === 'admin' && isFirstAdmin) || isAdmin;
      
      const formattedUserData: Partial<DBUser> & { password: string } = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: isAdmin ? 'admin' : userData.role,
        registration_approved: autoApprove,
        ...(userData.role === 'employer' && { organization: userData.organization })
      };

      const success = await registerUser(formattedUserData);
      
      if (success) {
        setVerificationSent(true);
        
        if (isAdmin) {
          setTimeout(() => {
            toast.info('Կարող եք մուտք գործել համակարգ', {
              description: 'Ձեր ադմինիստրատորի հաշիվը ակտիվ է։ Օգտագործեք մուտքի ձևը հիմա։'
            });
          }, 1500);
        }
      }
    } catch (error) {
      toast.error('Սխալ', {
        description: 'Տեղի ունեցավ անսպասելի սխալ',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Մուտք / Գրանցում</CardTitle>
            <CardDescription>
              Մուտք գործեք համակարգ կամ ստեղծեք նոր հաշիվ
            </CardDescription>
            {isFirstAdmin && (
              <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md">
                Առաջին ադմինիստրատորի հաշիվը կհաստատվի ավտոմատ կերպով
              </div>
            )}
            {designatedAdminMessage && (
              <div className="mt-2 p-2 bg-green-50 text-green-700 rounded-md">
                Ադմինիստրատորի հաշիվը (gitedu@bk.ru) գրանցված է։ Մուտք գործեք Ձեր գաղտնաբառով։
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Մուտք</TabsTrigger>
                <TabsTrigger value="register">Գրանցում</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm onLogin={handleLogin} isLoading={isLoading} />
              </TabsContent>
              
              <TabsContent value="register">
                <RegisterForm 
                  onRegister={handleRegister} 
                  isLoading={isLoading} 
                  verificationSent={verificationSent} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Դարձեք մեր համայնքի անդամ հենց այսօր
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
