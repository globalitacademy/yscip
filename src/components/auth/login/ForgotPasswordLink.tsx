
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ForgotPasswordLink: React.FC = () => {
  const navigate = useNavigate();
  
  const handleForgotPassword = () => {
    navigate('/?tab=admin');
    toast.info('Ադմինիստրատորի հաշվի վերականգնման համար օգտագործեք "Ադմին" բաժինը։');
  };
  
  return (
    <div className="flex items-center justify-end">
      <Button 
        variant="link" 
        type="button" 
        className="p-0 h-auto text-sm"
        onClick={handleForgotPassword}
      >
        Մոռացել եք գաղտնաբառը?
      </Button>
    </div>
  );
};

export default ForgotPasswordLink;
