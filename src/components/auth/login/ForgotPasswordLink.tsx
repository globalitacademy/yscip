
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ForgotPasswordLink: React.FC = () => {
  return (
    <div className="flex items-center justify-end">
      <Button 
        variant="link" 
        type="button" 
        className="p-0 h-auto text-sm text-muted-foreground group transition-all duration-300 hover:text-primary"
      >
        <span className="relative after:absolute after:block after:w-full after:h-px after:bottom-0 after:left-0 after:bg-primary after:origin-left after:scale-x-0 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
          Մոռացել եք գաղտնաբառը?
        </span>
        <ArrowRight className="ml-1 h-3 w-3 opacity-0 transform translate-x-[-8px] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
      </Button>
    </div>
  );
};

export default ForgotPasswordLink;
