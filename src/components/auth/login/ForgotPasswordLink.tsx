
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ForgotPasswordLink: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);
  
  const handleResetAdmin = async () => {
    try {
      setIsResetting(true);
      
      // Call Supabase Edge Function to reset admin account
      const { data, error } = await supabase.functions.invoke('ensure-admin-activation');
      
      if (error) {
        console.error('Error calling admin activation function:', error);
        toast.error('Սխալ ադմինիստրատորի հաշիվը վերականգնելիս։');
        return;
      }
      
      console.log('Admin activation result:', data);
      
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
  
  return (
    <div className="flex flex-col items-end space-y-2">
      <Button variant="link" type="button" className="p-0 h-auto text-sm">
        Մոռացել եք գաղտնաբառը?
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="text-xs"
        onClick={handleResetAdmin}
        disabled={isResetting}
      >
        {isResetting ? 
          <span className="flex items-center gap-1">
            <span className="animate-spin h-3 w-3 border-2 border-b-transparent rounded-full"></span>
            Վերականգնում...
          </span> : 
          'Վերականգնել ադմինի հաշիվը'
        }
      </Button>
    </div>
  );
};

export default ForgotPasswordLink;
