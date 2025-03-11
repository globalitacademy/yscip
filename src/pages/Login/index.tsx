
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DBUser } from '@/types/database.types';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { RegisterUserData } from './types';

const Login: React.FC = () => {
  const { login, registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: 'Մուտքն հաջողվել է',
          description: 'Դուք հաջողությամբ մուտք եք գործել համակարգ',
        });
        navigate('/');
      } else {
        toast({
          title: 'Մուտքը չի հաջողվել',
          description: 'Էլ․ հասցեն կամ գաղտնաբառը սխալ է կամ Ձեր հաշիվը դեռ ակտիվացված չէ',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Սխալ',
        description: 'Տեղի ունեցավ անսպասելի սխալ',
        variant: 'destructive',
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
        toast({
          title: 'Սխալ',
          description: 'Կազմակերպության անունը պարտադիր է գործատուի համար',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      const formattedUserData: Partial<DBUser> & { password: string } = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        registration_approved: userData.role === 'student', // Students are auto-approved
        ...(userData.role === 'employer' && { organization: userData.organization })
      };

      const success = await registerUser(formattedUserData);
      
      if (success) {
        setVerificationSent(true);
      }
    } catch (error) {
      toast({
        title: 'Սխալ',
        description: 'Տեղի ունեցավ անսպասելի սխալ',
        variant: 'destructive',
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
