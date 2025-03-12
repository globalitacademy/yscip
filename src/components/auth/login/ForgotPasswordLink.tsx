
import React from 'react';
import { Button } from '@/components/ui/button';

const ForgotPasswordLink: React.FC = () => {
  return (
    <div className="flex items-center justify-end">
      <Button variant="link" type="button" className="p-0 h-auto text-sm">
        Մոռացել եք գաղտնաբառը?
      </Button>
    </div>
  );
};

export default ForgotPasswordLink;
