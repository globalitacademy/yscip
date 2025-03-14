
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ForgotPasswordLink: React.FC = () => {
  return (
    <div className="flex items-center justify-end">
      <Button 
        variant="link" 
        type="button" 
        className="p-0 h-auto text-sm text-indigo-600 group transition-all duration-300 hover:text-indigo-800"
      >
        <span className="bg-gradient-to-r from-indigo-600 to-violet-700 bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_1px] group-hover:bg-[length:100%_1px]">
          Մոռացել եք գաղտնաբառը?
        </span>
        <ArrowRight className="ml-1 h-3 w-3 opacity-0 transform translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </Button>
    </div>
  );
};

export default ForgotPasswordLink;
