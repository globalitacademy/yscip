
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRoleWithApproval, setIsRoleWithApproval] = useState(false);

  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        // Get token and type from the URL if present
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const type = params.get('type');
        
        // If we have token and type, the user is being redirected from the email
        if (token && type) {
          // Let Supabase handle the verification automatically
          // by just letting user access the page with the token in URL
          console.log('Email verification token detected in URL');
        }

        // Check if user has a valid session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setVerificationStatus('error');
          setErrorMessage('Հաստատման գործընթացի սխալ: Սեսիայի տվյալները հասանելի չեն։');
          return;
        }
        
        if (data?.session?.user) {
          // Check user status
          const user = data.session.user;
          
          if (user.email_confirmed_at) {
            setVerificationStatus('success');
            
            // Check if user needs approval
            const role = user.user_metadata?.role;
            if (role && ['lecturer', 'employer', 'project_manager', 'supervisor'].includes(role)) {
              setIsRoleWithApproval(true);
            }
          } else {
            setVerificationStatus('error');
            setErrorMessage('Էլ․ հասցեն դեռ չի հաստատվել։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը։');
          }
        } else {
          // If there's a token in the URL but no session, it might mean the verification
          // worked but the user isn't automatically logged in yet
          if (token && type) {
            setVerificationStatus('success');
            setErrorMessage('');
          } else {
            setVerificationStatus('error');
            setErrorMessage('Հաստատման հղումը սխալ է կամ ժամկետանց։');
          }
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setErrorMessage(error.message || 'Հաստատման գործընթացի սխալ: Խնդրում ենք փորձել կրկին։');
      }
    };

    checkEmailVerification();
  }, [location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Էլ․ հասցեի հաստատում</CardTitle>
            <CardDescription>
              Ձեր էլ․ հասցեի հաստատման կարգավիճակը
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center justify-center py-8">
            {verificationStatus === 'loading' && (
              <div className="text-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
                <p className="text-lg font-medium">Հաստատման գործընթացը ընթանում է...</p>
              </div>
            )}
            
            {verificationStatus === 'success' && (
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium">Ձեր էլ․ հասցեն հաջողությամբ հաստատվել է</p>
                
                {isRoleWithApproval ? (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-left">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-900">Անհրաժեշտ է ադմինիստրատորի հաստատում</p>
                        <p className="text-sm text-amber-800 mt-1">
                          Ձեր հաշիվը հաստատվել է, սակայն այն պետք է հաստատվի նաև ադմինիստրատորի կողմից: 
                          Հաստատումից հետո Դուք կկարողանաք մուտք գործել համակարգ:
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-2">
                    Այժմ Դուք կարող եք մուտք գործել համակարգ Ձեր հաշվի տվյալներով:
                  </p>
                )}
              </div>
            )}
            
            {verificationStatus === 'error' && (
              <div className="text-center">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-medium">Հաստատման սխալ</p>
                <p className="text-muted-foreground mt-2">{errorMessage}</p>
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-left">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900">Հնարավոր պատճառներ</p>
                      <ul className="list-disc list-inside text-sm text-amber-800 mt-1">
                        <li>Հաստատման հղումը սխալ է կամ ժամկետանց</li>
                        <li>Հղումն արդեն օգտագործվել է</li>
                        <li>Ձեր հաշիվն արդեն ակտիվացված է</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => navigate('/login')} 
              variant={verificationStatus === 'success' ? "default" : "outline"}
              className="w-full max-w-xs"
            >
              {verificationStatus === 'success' ? 'Մուտք գործել' : 'Վերադառնալ մուտքի էջ'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
