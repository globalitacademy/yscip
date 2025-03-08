
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Get token from URL query params
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      setVerificationStatus('error');
      setErrorMessage('Հաստատման գործընթացի սխալ: Նշանը (token) բացակայում է։');
      return;
    }

    // In a real application, this would be an API call to verify the token
    // For demo purposes, we'll simulate the verification process
    const verifyToken = async () => {
      try {
        // Simulate API call with 2 second delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For demo, we'll consider the verification successful
        // In a real application, this would check the token with the backend
        setVerificationStatus('success');
      } catch (error) {
        setVerificationStatus('error');
        setErrorMessage('Հաստատման գործընթացի սխալ: Խնդրում ենք փորձել կրկին։');
      }
    };

    verifyToken();
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
                <p className="text-muted-foreground mt-2">
                  Այժմ Դուք կարող եք մուտք գործել համակարգ Ձեր հաշվի տվյալներով:
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
