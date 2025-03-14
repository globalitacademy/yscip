
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ForgotPasswordLink: React.FC = () => {
  return (
    <div className="flex items-center justify-end">
      <Button 
        variant="link" 
        type="button" 
        className="p-0 h-auto text-sm group transition-all duration-300 hover:text-primary"
      >
        Մոռացել եք գաղտնաբառը?
        <ArrowRight className="ml-1 h-3 w-3 opacity-0 transform translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </Button>
    </div>
  );
};

export default ForgotPasswordLink;
