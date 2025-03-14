
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegistrationForm from '@/components/auth/RegistrationForm';
import DemoAccounts from '@/components/auth/DemoAccounts';
import VerificationAlert from '@/components/auth/verification/VerificationAlert';
import { useDemoLogin } from '@/hooks/useDemoLogin';
import { useVerification } from '@/hooks/useVerification';
import { ScaleIn, SlideUp, StaggeredContainer } from '@/components/Transitions';

const Login: React.FC = () => {
  const { isLoggingIn, handleQuickLogin } = useDemoLogin();
  
  const {
    verificationSent,
    resendEmail,
    verificationToken,
    handleResendVerification,
    handleRegistrationSuccess
  } = useVerification();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-accent/30 p-4 overflow-hidden">
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-1/4 h-1/4 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[30%] right-[10%] w-1/5 h-1/5 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
      
      <ScaleIn className="w-full max-w-md relative z-10">
        <Card className="shadow-xl backdrop-blur-sm bg-card/90 border border-border/50 overflow-hidden">
          <CardHeader className="space-y-1 text-center">
            <SlideUp delay="delay-100">
              <CardTitle className="text-2xl font-bold">Մուտք / Գրանցում</CardTitle>
            </SlideUp>
            <SlideUp delay="delay-200">
              <CardDescription>
                Մուտք գործեք համակարգ կամ ստեղծեք նոր հաշիվ
              </CardDescription>
            </SlideUp>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <StaggeredContainer>
                <TabsList className="grid w-full grid-cols-3 mb-4 rounded-xl p-1">
                  <TabsTrigger value="login" className="rounded-lg transition-all data-[state=active]:shadow-md">Մուտք</TabsTrigger>
                  <TabsTrigger value="register" className="rounded-lg transition-all data-[state=active]:shadow-md">Գրանցում</TabsTrigger>
                  <TabsTrigger value="demo" className="rounded-lg transition-all data-[state=active]:shadow-md">Դեմո հաշիվներ</TabsTrigger>
                </TabsList>
              </StaggeredContainer>
              
              <TabsContent value="login" className="transition-all duration-500 ease-apple-ease">
                <LoginForm />
              </TabsContent>
              
              <TabsContent value="register" className="transition-all duration-500 ease-apple-ease">
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
              
              <TabsContent value="demo" className="transition-all duration-500 ease-apple-ease">
                <DemoAccounts onQuickLogin={handleQuickLogin} />
                {isLoggingIn && (
                  <div className="mt-4 text-center animate-pulse">
                    <p>Մուտք դեմո հաշիվ...</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </ScaleIn>
    </div>
  );
};

export default Login;
