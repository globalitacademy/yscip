
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { isDesignatedAdmin, checkFirstAdmin } from '@/contexts/auth/utils';
import { toast } from 'sonner';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);
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

    const processUser = async () => {
      if (emailParam) {
        try {
          // Check if designated admin
          const adminResult = await isDesignatedAdmin(emailParam);
          setIsAdmin(adminResult);
          
          // Check if first admin
          if (!adminResult) {
            const firstAdminResult = await checkFirstAdmin();
            setIsFirstAdmin(firstAdminResult);
            
            if (firstAdminResult) {
              console.log('First admin detected:', emailParam);
              setVerificationStatus('success');
              
              // Call the RPC to ensure first admin is approved
              try {
                const { error } = await supabase.rpc(
                  'approve_first_admin',
                  { admin_email: emailParam }
                );
                
                if (error) {
                  console.error('Error approving first admin:', error);
                } else {
                  console.log('First admin approved successfully');
                  toast.success('Առաջին ադմինի հաշիվը հաստատվել է', {
                    description: 'Ձեզ տրվել են լիարժեք ադմինիստրատորի իրավունքներ'
                  });
                  
                  // Auto redirect to admin dashboard
                  setTimeout(() => {
                    navigate('/admin');
                  }, 2000);
                }
              } catch (err) {
                console.error('Error in first admin approval:', err);
              }
              
              return;
            }
          }
          
          if (adminResult) {
            console.log('Admin email detected, verifying account');
            setVerificationStatus('success');
            
            // Ensure admin verification and create proper profile
            const { error } = await supabase.rpc('ensure_admin_login');
            
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
                  toast.success('Ադմինիստրատորի հաշիվը հաստատվել է', {
                    description: 'Դուք հիմա կուղղորդվեք կառավարման վահանակ'
                  });
                  
                  setTimeout(() => {
                    navigate('/admin');
                  }, 1500);
                }
              } catch (err) {
                console.error('Error in admin auto-login:', err);
              }
            }
            return;
          }
        } catch (err) {
          console.error('Error checking user type:', err);
        }
      }
    };
    
    // First process special admin cases
    processUser();

    // Handle verification token process for regular users
    const verifyToken = async () => {
      try {
        if (isAdmin || isFirstAdmin) {
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
          
          // Verify the OTP token
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
            
            // Auto sign-in the user after verification if possible
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
                  .eq('email', emailParam || '')
                  .single();
                  
                if (!userError && userData) {
                  console.log('User role after verification:', userData.role);
                  
                  // Redirect to appropriate dashboard
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
        } else if (!isAdmin && !isFirstAdmin) {
          setVerificationStatus('error');
          setErrorMessage('Հաստատման գործընթացի սխալ: Նշանը (token) բացակայում է։');
        }
      } catch (error) {
        console.error('Verification process error:', error);
        setVerificationStatus('error');
        setErrorMessage('Հաստատման գործընթացի սխալ: Խնդրում ենք փորձել կրկին։');
      }
    };

    verifyToken();
  }, [location.search, navigate, isAdmin, isFirstAdmin]);

  const handleDashboardClick = () => {
    if (isAdmin || isFirstAdmin) {
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
                    : isFirstAdmin
                    ? 'Որպես առաջին ադմինիստրատոր, Ձեզ տրվել են լիարժեք իրավունքներ:'
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
              {isAdmin || isFirstAdmin ? 'Անցնել կառավարման վահանակ' : 
                (verificationStatus === 'success' ? 'Մուտք գործել' : 'Վերադառնալ մուտքի էջ')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
