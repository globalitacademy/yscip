
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegistrationForm from '@/components/auth/RegistrationForm';
import DemoAccounts from '@/components/auth/DemoAccounts';
import VerificationAlert from '@/components/auth/verification/VerificationAlert';
import { useDemoLogin } from '@/hooks/useDemoLogin';
import { useVerification } from '@/hooks/useVerification';
import { FadeIn, SlideUp } from '@/components/LocalTransitions';
import { GraduationCap } from 'lucide-react';

const Login: React.FC = () => {
  const { isLoggingIn, handleQuickLogin } = useDemoLogin();
  const [activeTab, setActiveTab] = useState("login");
  const [animate, setAnimate] = useState(false);
  
  const {
    verificationSent,
    resendEmail,
    verificationToken,
    handleResendVerification,
    handleRegistrationSuccess
  } = useVerification();

  useEffect(() => {
    // Trigger animation after a short delay
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-0">
        <div className="absolute inset-0 opacity-30">
          {/* Abstract shapes */}
          <div className="absolute top-[-10%] left-[-5%] w-1/2 h-1/2 rounded-full blur-3xl bg-indigo-100/30 animate-[float_25s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-[-15%] right-[-10%] w-3/4 h-3/4 rounded-full blur-3xl bg-purple-100/30 animate-[float_35s_ease-in-out_infinite_reverse]"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0" 
               style={{
                 backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                 backgroundSize: '70px 70px'
               }}>
          </div>
        </div>
      </div>
      
      <div className={`relative z-10 w-full max-w-md px-4 transition-all duration-700 ease-out ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="mb-8 text-center">
          <FadeIn delay="delay-100">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-md bg-primary/20"></div>
                <div className="relative bg-card/80 backdrop-blur-sm text-primary p-3 rounded-full border border-border/40 shadow-xl">
                  <GraduationCap size={32} />
                </div>
              </div>
            </div>
          </FadeIn>
          
          <SlideUp delay="delay-300">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Ուսանողական նախագծեր
            </h1>
          </SlideUp>
          
          <SlideUp delay="delay-400">
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              Ողջույն, մուտք գործեք Ձեր հաշիվ կամ ստեղծեք նոր հաշիվ
            </p>
          </SlideUp>
        </div>
        
        <SlideUp delay="delay-500">
          <Card className="border-none shadow-lg backdrop-blur-sm bg-card/90 overflow-hidden rounded-2xl transition-all duration-500">
            <CardHeader className="space-y-1 text-center pb-2">
              <CardTitle className="text-xl font-semibold">
                Մուտք / Գրանցում
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Մուտք գործեք համակարգ կամ ստեղծեք նոր հաշիվ
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-2">
              <Tabs 
                defaultValue="login" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 rounded-lg h-10">
                  <TabsTrigger value="login" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    Մուտք
                  </TabsTrigger>
                  <TabsTrigger value="register" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    Գրանցում
                  </TabsTrigger>
                  <TabsTrigger value="demo" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    Դեմո
                  </TabsTrigger>
                </TabsList>
                
                <div className="overflow-hidden">
                  <TabsContent value="login" className={`transition-all duration-300 ease-out ${activeTab === 'login' ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                    <LoginForm />
                  </TabsContent>
                  
                  <TabsContent value="register" className={`transition-all duration-300 ease-out ${activeTab === 'register' ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
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
                  
                  <TabsContent value="demo" className={`transition-all duration-300 ease-out ${activeTab === 'demo' ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
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
        </SlideUp>
        
        <SlideUp delay="delay-700">
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Երևանի ինֆորմատիկայի պետական քոլեջ</p>
          </div>
        </SlideUp>
      </div>
    </div>
  );
};

export default Login;
