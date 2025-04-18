
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegistrationForm from '@/components/auth/RegistrationForm';
import DemoAccounts from '@/components/auth/DemoAccounts';
import { useDemoLogin } from '@/hooks/useDemoLogin';
import { useVerification } from '@/hooks/useVerification';
import { useAuth } from '@/contexts/AuthContext';
import VerificationAlert from '@/components/auth/verification/VerificationAlert';

const Login: React.FC = () => {
  const { isLoggingIn, handleQuickLogin } = useDemoLogin();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);
  
  const {
    verificationSent,
    resendEmail,
    verificationToken,
    handleResendVerification,
    handleRegistrationSuccess
  } = useVerification();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
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
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="login">Մուտք</TabsTrigger>
                <TabsTrigger value="register">Գրանցում</TabsTrigger>
                <TabsTrigger value="demo">Դեմո հաշիվներ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm />
                {/* Removed DeveloperInfo component */}
              </TabsContent>
              
              <TabsContent value="register">
                {verificationSent ? (
                  <VerificationAlert 
                    email={resendEmail} 
                    verificationToken={verificationToken} 
                    onResend={handleResendVerification} 
                  />
                ) : (
                  <RegistrationForm onSuccess={handleRegistrationSuccess} />
                )}
              </TabsContent>
              
              <TabsContent value="demo">
                <DemoAccounts onQuickLogin={handleQuickLogin} />
                {isLoggingIn && (
                  <div className="mt-4 text-center">
                    <p>Մուտք դեմո հաշիվ...</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

