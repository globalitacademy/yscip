
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, AlertCircle } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('error');
  const [errorMessage, setErrorMessage] = useState('Բեքենդը հեռացվել է, հաստատման ֆունկցիոնալությունը անհասանելի է');

  useEffect(() => {
    // The backend has been removed, so we'll set an error status
    setVerificationStatus('error');
    setErrorMessage('Բեքենդը հեռացվել է, հաստատման ֆունկցիոնալությունը անհասանելի է');
  }, []);

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
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-medium">Հաստատման սխալ</p>
              <p className="text-muted-foreground mt-2">{errorMessage}</p>
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-left">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <p className="font-medium text-amber-900">
                    Բեքենդը հեռացվել է, հաստատման ֆունկցիոնալությունը անհասանելի է
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => navigate('/login')} 
              variant="outline" 
              className="w-full max-w-xs"
            >
              Վերադառնալ մուտքի էջ
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
