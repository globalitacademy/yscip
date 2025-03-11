
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { isDesignatedAdmin } from '@/contexts/auth/utils';
import { toast } from 'sonner';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const emailParam = params.get('email');
    const type = params.get('type');

    console.log('Verification params:', { token, email: emailParam, type });
    
    if (emailParam) {
      setEmail(emailParam);
    }

    const checkIfAdmin = async () => {
      if (emailParam) {
        try {
          const result = await isDesignatedAdmin(emailParam);
          console.log('Is designated admin check result:', result);
          setIsAdmin(result);
          
          if (result) {
            setVerificationStatus('success');
            
            // Ensure admin verification and create proper profile
            console.log('Admin email detected, verifying account');
            const { error } = await supabase.rpc('verify_designated_admin');
            
            if (error) {
              console.error('Error verifying admin via RPC:', error);
              toast.error('Ադմինի հաշվի ստուգման սխալ', {
                description: 'Փորձեք վերակայել ադմինի հաշիվը'
              });
            } else {
              console.log('Admin verified successfully via RPC');
              
              // Try to automatically sign in the admin
              try {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                  email: 'gitedu@bk.ru',
                  password: 'Qolej2025*'
                });
                
                if (signInError) {
                  console.log('Admin auto-login attempt failed:', signInError.message);
                  toast.error('Ավտոմատ մուտքը չի հաջողվել', {
                    description: 'Խնդրում ենք մուտք գործել ձեռքով՝ օգտագործելով մուտքի ձևը'
                  });
                } else {
                  console.log('Admin auto-login successful');
                  setTimeout(() => {
                    navigate('/admin');
                  }, 1500);
                  
                  toast.success('Ադմինիստրատորի հաշիվը հաստատվել է', {
                    description: 'Դուք հիմա կուղղորդվեք կառավարման վահանակ'
                  });
                }
              } catch (err) {
                console.error('Error in admin auto-login:', err);
              }
            }
            return;
          }
        } catch (err) {
          console.error('Error checking if admin:', err);
        }
      }
    };
    
    checkIfAdmin();

    if (!token && !isAdmin) {
      setVerificationStatus('error');
      setErrorMessage('Հաստատման գործընթացի սխալ: Նշանը (token) բացակայում է։');
      return;
    }

    const verifyToken = async () => {
      try {
        if (isAdmin) {
          console.log('Admin account, skipping token verification');
          setVerificationStatus('success');
          return;
        }
        
        if (token) {
          console.log('Verifying token');
          if (type === 'recovery') {
            navigate('/login#type=recovery' + (emailParam ? `&email=${encodeURIComponent(emailParam)}` : ''));
            return;
          }
          
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email'
          });
          
          if (error) {
            console.error('Token verification error:', error);
            setVerificationStatus('error');
            setErrorMessage('Հաստատման գործընթացի սխալ: ' + error.message);
          } else {
            console.log('Token verified successfully');
            setVerificationStatus('success');
            
            // If we have an email, try signing in the user automatically
            if (emailParam) {
              try {
                const { data, error: signInError } = await supabase.auth.getSession();
                
                if (signInError) {
                  console.error('Error getting session after verification:', signInError);
                } else if (data.session) {
                  console.log('User is signed in after verification');
                  // Redirect based on user role
                  const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('role')
                    .eq('email', emailParam)
                    .single();
                    
                  if (!userError && userData) {
                    console.log('User role after verification:', userData.role);
                    setTimeout(() => {
                      switch (userData.role) {
                        case 'admin':
                          navigate('/admin');
                          break;
                        case 'student':
                          navigate('/student-dashboard');
                          break;
                        default:
                          navigate('/');
                      }
                    }, 1500);
                  }
                }
              } catch (err) {
                console.error('Error in auto-redirect after verification:', err);
              }
            }
          }
        }
      } catch (error) {
        console.error('Verification process error:', error);
        setVerificationStatus('error');
        setErrorMessage('Հաստատման գործընթացի սխալ: Խնդրում ենք փորձել կրկին։');
      }
    };

    verifyToken();
  }, [location.search, isAdmin, navigate]);

  const handleDashboardClick = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/login');
    }
  };

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
                <p className="text-muted-foreground mt-2">
                  {isAdmin 
                    ? 'Որպես ադմինիստրատոր, Ձեր հաշիվն ավտոմատ կերպով հաստատվել է:'
                    : 'Այժմ Դուք կարող եք մուտք գործել համակարգ Ձեր հաշվի տվյալներով:'}
                </p>
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
              onClick={handleDashboardClick} 
              variant={verificationStatus === 'success' ? "default" : "outline"}
              className="w-full max-w-xs"
            >
              {isAdmin ? 'Անցնել կառավարման վահանակ' : 
                (verificationStatus === 'success' ? 'Մուտք գործել' : 'Վերադառնալ մուտքի էջ')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
