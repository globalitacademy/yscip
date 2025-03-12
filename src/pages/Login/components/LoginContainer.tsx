
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';
import { AdminSetup } from './AdminSetup';

interface LoginContainerProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (userData: any) => Promise<void>;
  isLoading: boolean;
  verificationSent: boolean;
  email?: string | null;
  showAdminReset: boolean;
  registeredRole?: string | null;
}

export const LoginContainer: React.FC<LoginContainerProps> = ({
  onLogin,
  onRegister,
  isLoading,
  verificationSent,
  email,
  showAdminReset,
  registeredRole
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Մուտք / Գրանցում</CardTitle>
            <CardDescription>
              Մուտք գործեք համակարգ կամ ստեղծեք նոր հաշիվ
            </CardDescription>
            <AdminSetup email={email} />
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Մուտք</TabsTrigger>
                <TabsTrigger value="register">Գրանցում</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm onLogin={onLogin} isLoading={isLoading} />
              </TabsContent>
              
              <TabsContent value="register">
                <RegisterForm 
                  onRegister={onRegister} 
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
