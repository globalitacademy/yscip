
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { isDesignatedAdmin } from '@/contexts/auth/utils/sessionHelpers';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get token from URL query params
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email'); // Some email verification links include email
    const type = params.get('type'); // Check if this is a recovery link

    console.log('Verification params:', { token, email, type });

    const checkIfAdmin = async () => {
      if (email) {
        const result = await isDesignatedAdmin(email);
        console.log('Is designated admin check result:', result);
        setIsAdmin(result);
        
        if (result) {
          // If this is the designated admin, automatic success
          setVerificationStatus('success');
          // Try to manually verify the email if needed
          try {
            await supabase.auth.updateUser({
              data: { email_confirmed: true }
            });
            console.log('Admin email manually confirmed');
          } catch (err) {
            console.error('Error manually confirming admin email:', err);
          }
          return;
        }
      }
    };
    
    checkIfAdmin();

    if (!token && !isAdmin) {
      setVerificationStatus('error');
      setErrorMessage('Հաստատման գործընթացի սխալ: Նշանը (token) բացակայում է։');
      return;
    }

    // Verify the token with Supabase
    const verifyToken = async () => {
      try {
        if (isAdmin) {
          console.log('Admin account, skipping token verification');
          setVerificationStatus('success');
          return;
        }
        
        // For normal users, need to verify the token
        if (token) {
          console.log('Verifying token');
          if (type === 'recovery') {
            // This is a password reset link, don't try to verify it
            navigate('/login');
            return;
          }
          
          // For email verification links
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
