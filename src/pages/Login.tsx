
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegistrationForm from '@/components/auth/RegistrationForm';
import DemoAccounts from '@/components/auth/DemoAccounts';
import VerificationAlert from '@/components/auth/verification/VerificationAlert';
import { useDemoLogin } from '@/hooks/useDemoLogin';
import { useVerification } from '@/hooks/useVerification';

const Login: React.FC = () => {
  const { isLoggingIn, handleQuickLogin } = useDemoLogin();
  const [activeTab, setActiveTab] = useState("login");
  const [animateBackground, setAnimateBackground] = useState(false);
  
  const {
    verificationSent,
    resendEmail,
    verificationToken,
    handleResendVerification,
    handleRegistrationSuccess
  } = useVerification();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateBackground(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br from-indigo-100 via-violet-100 to-purple-100 transition-opacity duration-1000 ease-apple-ease ${animateBackground ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated shapes */}
          <div className="absolute top-[-5%] left-[-10%] w-2/3 h-1/2 bg-gradient-to-br from-purple-200/50 to-indigo-300/50 rounded-full blur-3xl transform rotate-12 animate-[float_25s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-1/2 h-2/3 bg-gradient-to-tr from-violet-300/50 to-purple-200/50 rounded-full blur-3xl transform -rotate-12 animate-[float_20s_ease-in-out_infinite_reverse]"></div>
          <div className="absolute top-[30%] right-[15%] w-1/3 h-1/3 bg-gradient-to-tr from-indigo-200/40 to-blue-300/40 rounded-full blur-3xl transform rotate-6 animate-[float_28s_ease-in-out_infinite_1s]"></div>
        </div>
      </div>
      
      <div className="w-full max-w-md z-10 animate-scale-in">
        <Card className="border-none shadow-xl backdrop-blur-sm bg-white/80 overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
          <CardHeader className="space-y-1 text-center pb-2">
            <div className="animate-slide-up">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-700 bg-clip-text text-transparent">
                Մուտք / Գրանցում
              </CardTitle>
            </div>
            <div className="animate-slide-up opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
              <CardDescription className="text-gray-500">
                Մուտք գործեք համակարգ կամ ստեղծեք նոր հաշիվ
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs 
              defaultValue="login" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="animate-slide-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                <TabsList className="grid w-full grid-cols-3 mb-4 bg-muted/50 rounded-xl p-1">
                  <TabsTrigger value="login" className="rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-md">
                    Մուտք
                  </TabsTrigger>
                  <TabsTrigger value="register" className="rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-md">
                    Գրանցում
                  </TabsTrigger>
                  <TabsTrigger value="demo" className="rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-md">
                    Դեմո հաշիվներ
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="overflow-hidden">
                <TabsContent value="login" className={`animate-fade-in transition-all duration-500 ease-apple-ease ${activeTab === 'login' ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                  <LoginForm />
                </TabsContent>
                
                <TabsContent value="register" className={`animate-fade-in transition-all duration-500 ease-apple-ease ${activeTab === 'register' ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
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
                
                <TabsContent value="demo" className={`animate-fade-in transition-all duration-500 ease-apple-ease ${activeTab === 'demo' ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                  <DemoAccounts onQuickLogin={handleQuickLogin} />
                  {isLoggingIn && (
                    <div className="mt-4 text-center animate-pulse">
                      <p>Մուտք դեմո հաշիվ...</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6 text-xs text-white/70 animate-fade-in opacity-0" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
          <p className="backdrop-blur-sm px-2 py-1 inline-block rounded">
            © 2025 Երևանի ինֆորմատիկայի պետական քոլեջ
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
