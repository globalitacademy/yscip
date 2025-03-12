
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRoleWithApproval, setIsRoleWithApproval] = useState(false);

  useEffect(() => {
    // Get token from URL query params
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      setVerificationStatus('error');
      setErrorMessage('Հաստատման գործընթացի սխալ: Նշանը (token) բացակայում է։');
      return;
    }

    // Call the verifyEmail function from AuthContext
    const verifyToken = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verify the token
        const success = await verifyEmail(token);
        
        if (success) {
          setVerificationStatus('success');
          
          // Check in localStorage if this is a role that needs approval
          const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
          const user = pendingUsers.find((u: any) => u.verificationToken === token);
          
          if (user && ['lecturer', 'employer', 'project_manager', 'supervisor'].includes(user.role)) {
            setIsRoleWithApproval(true);
          }
        } else {
          setVerificationStatus('error');
          setErrorMessage('Հաստատման գործընթացի սխալ: Հղումն անվավեր է կամ արդեն օգտագործվել է։');
        }
      } catch (error) {
        setVerificationStatus('error');
        setErrorMessage('Հաստատման գործընթացի սխալ: Խնդրում ենք փորձել կրկին։');
      }
    };

    verifyToken();
  }, [location.search, verifyEmail]);

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
