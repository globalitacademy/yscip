
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleResetAdmin = async () => {
    try {
      setIsResetting(true);
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('ensure-admin-activation');
      
      if (error) {
        console.error('Error calling admin activation function:', error);
        toast.error('Սխալ ադմինիստրատորի հաշիվը վերականգնելիս։');
        return;
      }
      
      if (data.success) {
        toast.success('Ադմինիստրատորի հաշիվը վերականգնված է։');
      } else {
        toast.error('Սխալ ադմինիստրատորի հաշիվը վերականգնելիս։');
      }
    } catch (error) {
      console.error('Error resetting admin account:', error);
      toast.error('Սխալ ադմինիստրատորի հաշիվը վերականգնելիս։');
    } finally {
      setIsResetting(false);
    }
  };
  
  const handleAdminLogin = async () => {
    if (!email || !password) {
      toast.error('Խնդրում ենք լրացնել բոլոր դաշտերը');
      return;
    }
    
    try {
      setIsLoggingIn(true);
      
      const success = await login(email, password);
      
      if (success) {
        toast.success('Մուտքն հաջողվել է', {
          description: 'Դուք հաջողությամբ մուտք եք գործել համակարգ որպես ադմինիստրատոր',
        });
        navigate('/admin');
      } else {
        toast.error('Մուտքը չի հաջողվել', {
          description: 'Չհաջողվեց մուտք գործել ադմինիստրատորի հաշիվ',
        });
      }
    } catch (error) {
      console.error('Error logging in as admin:', error);
      toast.error('Սխալ ադմինիստրատորի հաշիվ մուտք գործելիս։');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-sm">
        <h3 className="font-semibold mb-1">Ադմինիստրատորի մուտք</h3>
        <p>Մուտքագրեք ադմինիստրատորի հավատարմագրերը</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="admin-email">Էլ. հասցե</Label>
          <Input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ադմինիստրատորի էլ. հասցե"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="admin-password">Գաղտնաբառ</Label>
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ադմինիստրատորի գաղտնաբառ"
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleAdminLogin}
          className="w-full"
          disabled={isLoggingIn || isResetting}
        >
          {isLoggingIn ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full"></span>
              Մուտք ադմինիստրատորի հաշիվ...
            </span>
          ) : (
            'Մուտք ադմինիստրատորի հաշիվ'
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleResetAdmin}
          className="w-full"
          disabled={isResetting || isLoggingIn}
        >
          {isResetting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full"></span>
              Վերականգնում...
            </span>
          ) : (
            'Վերականգնել ադմինի հաշիվը'
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminLogin;
