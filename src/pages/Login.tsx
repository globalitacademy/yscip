
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertCircle, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Info, Copy } from 'lucide-react';
import { UserRole } from '@/data/userRoles';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegistrationForm from '@/components/auth/RegistrationForm';
import DemoAccounts from '@/components/auth/DemoAccounts';
import AdminReset from '@/components/AdminReset';

const Login: React.FC = () => {
  const [showDeveloperInfo, setShowDeveloperInfo] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const { sendVerificationEmail } = useAuth();

  const handleResendVerification = async () => {
    if (!resendEmail) return;
    
    const result = await sendVerificationEmail(resendEmail);
    if (result.success) {
      setVerificationToken(result.token || '');
      toast.success('Հաստատման հղումը կրկին ուղարկված է', {
        description: 'Խնդրում ենք ստուգել Ձեր էլ․ փոստը'
      });
    } else {
      toast.error('Սխալ', {
        description: 'Չհաջողվեց վերաուղարկել հաստատման հղումը'
      });
    }
  };

  const handleRegistrationSuccess = (email: string, token: string) => {
    setVerificationSent(true);
    setResendEmail(email);
    setVerificationToken(token);
  };

  const copyVerificationLink = () => {
    const link = `${window.location.origin}/verify-email?token=${verificationToken}`;
    navigator.clipboard.writeText(link);
    toast.success('Հաստատման հղումը պատճենված է');
  };

  const handleQuickLogin = (role: UserRole) => {
    const email = `${role}@example.com`;
    setEmail(email);
    setPassword('password');
  };

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

                <div className="mt-4">
                  <Button 
                    variant="link" 
                    className="p-0 text-xs text-muted-foreground"
                    onClick={() => setShowDeveloperInfo(!showDeveloperInfo)}
                  >
                    {showDeveloperInfo ? 'Թաքցնել մշակողի տեղեկատվությունը' : 'Ցուցադրել մշակողի տեղեկատվությունը'}
                  </Button>
                </div>

                {showDeveloperInfo && (
                  <div className="mt-4 p-4 border rounded-md bg-muted/50">
                    <h3 className="font-medium mb-2 flex items-center gap-1">
                      <Info size={16} />
                      Մշակողի գործիքակազմ
                    </h3>
                    
                    <Alert className="mb-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Հիմնական ադմինիստրատորի հաշիվ</AlertTitle>
                      <AlertDescription>
                        <div className="mt-2 font-medium">
                          <div><strong>Էլ․ հասցե:</strong> gitedu@bk.ru</div>
                          <div><strong>Գաղտնաբառ:</strong> Qolej2025*</div>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Այս հաշիվն ունի բոլոր թույլտվությունները և կարող է հաստատել նոր օգտատերերի
                        </p>
                      </AlertDescription>
                    </Alert>
                    
                    <AdminReset />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="register">
                {verificationSent ? (
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Հաստատման հղումն ուղարկված է</AlertTitle>
                    <AlertDescription>
                      <p>
                        Ձեր էլ․ փոստին ուղարկվել է հաստատման հղում։ Խնդրում ենք ստուգել Ձեր փոստարկղը և սեղմել հղման վրա՝ հաշիվը ակտիվացնելու համար։
                      </p>
                      <div className="mt-4">
                        <Button onClick={handleResendVerification} size="sm" variant="outline">
                          Վերաուղարկել հաստատման հղումը
                        </Button>
                      </div>

                      <div className="mt-4 bg-muted p-3 rounded-md">
                        <p className="font-medium text-sm flex items-center mb-2">
                          <Info size={14} className="mr-1" />
                          Դեմո ռեժիմում հաստատեք հաշիվը հետևյալ հղումով:
                        </p>
                        <div className="flex items-center gap-2">
                          <Input 
                            readOnly 
                            className="text-xs bg-background" 
                            value={`${window.location.origin}/verify-email?token=${verificationToken}`}
                          />
                          <Button size="sm" variant="secondary" onClick={copyVerificationLink}>
                            <Copy size={14} />
                          </Button>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <RegistrationForm onSuccess={handleRegistrationSuccess} />
                )}
              </TabsContent>
              
              <TabsContent value="demo">
                <DemoAccounts onQuickLogin={handleQuickLogin} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
