
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle, XCircle, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Հաստատում...');
  
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Անվավեր հաստատման հղում');
        return;
      }
      
      try {
        // First try to confirm email directly with Supabase
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email'
          });
          
          if (!error) {
            console.log('Email confirmed via Supabase');
            setStatus('success');
            setMessage('Էլ․ հասցեն հաստատված է');
            return;
          }
        } catch (supabaseError) {
          console.error('Supabase verification error:', supabaseError);
          // Continue to fallback method
        }
        
        // Fallback to our custom verification
        const success = await verifyEmail(token);
        
        if (success) {
          setStatus('success');
          setMessage('Էլ․ հասցեն հաստատված է');
        } else {
          setStatus('error');
          setMessage('Անվավեր կամ ժամկետանց հաստատման հղում');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Տեղի է ունեցել անսպասելի սխալ');
      }
    };
    
    verifyToken();
  }, [token, verifyEmail]);
  
  const handleLogin = () => {
    toast.success('Հաշիվն ակտիվացված է, այժմ կարող եք մուտք գործել');
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Էլ․ հասցեի հաստատում</CardTitle>
          <CardDescription>
            {status === 'loading' ? 'Հաստատում ենք Ձեր էլ․ հասցեն' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          {status === 'loading' && (
            <div className="text-center py-6">
              <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin mb-4" />
              <p>{message}</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Շնորհակալություն հաստատման համար</h3>
              <p className="text-gray-500 mb-6">{message}</p>
              
              <div className="space-y-4">
                <Button onClick={handleLogin}>
                  Մուտք գործել
                </Button>
                
                <Button variant="outline" onClick={() => navigate('/')}>
                  <Home className="mr-2 h-4 w-4" />
                  Վերադառնալ գլխավոր էջ
                </Button>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center py-6">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Սխալ է տեղի ունեցել</h3>
              <p className="text-gray-500 mb-6">{message}</p>
              
              <div className="space-y-4">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Վերադառնալ մուտքի էջ
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
