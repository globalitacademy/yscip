
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
import { checkFirstAdmin } from '@/contexts/auth/utils/sessionHelpers';

const Login: React.FC = () => {
  const { login, registerUser, user, isAuthenticated, isApproved } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);

  // Check if there are existing admins
  useEffect(() => {
    const checkExistingAdmins = async () => {
      const firstAdmin = await checkFirstAdmin();
      setIsFirstAdmin(firstAdmin);
    };

    checkExistingAdmins();
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
      const success = await login(email, password);
      if (success) {
        toast.success('Մուտքն հաջողվել է', {
          description: 'Դուք հաջողությամբ մուտք եք գործել համակարգ',
        });
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
      // Check if employer has organization
      if (userData.role === 'employer' && !userData.organization) {
        toast.error('Սխալ', {
          description: 'Կազմակերպության անունը պարտադիր է գործատուի համար',
        });
        setIsLoading(false);
        return;
      }

      const autoApprove = userData.role === 'student' || (userData.role === 'admin' && isFirstAdmin);
      
      const formattedUserData: Partial<DBUser> & { password: string } = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        registration_approved: autoApprove, // Students and first admin are auto-approved
        ...(userData.role === 'employer' && { organization: userData.organization })
      };

      const success = await registerUser(formattedUserData);
      
      if (success) {
        setVerificationSent(true);
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
