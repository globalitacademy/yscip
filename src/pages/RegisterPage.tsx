
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RegistrationForm from '@/components/auth/RegistrationForm';
import { useVerification } from '@/hooks/useVerification';
import VerificationAlert from '@/components/auth/verification/VerificationAlert';

const RegisterPage: React.FC = () => {
  const {
    verificationSent,
    resendEmail,
    verificationToken,
    handleResendVerification,
    handleRegistrationSuccess
  } = useVerification();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Գրանցում</CardTitle>
            <CardDescription>
              Ստեղծեք նոր հաշիվ մուտք գործելու համար
            </CardDescription>
          </CardHeader>
          <CardContent>
            {verificationSent ? (
              <VerificationAlert 
                email={resendEmail} 
                verificationToken={verificationToken} 
                onResend={handleResendVerification} 
              />
            ) : (
              <RegistrationForm onSuccess={handleRegistrationSuccess} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
