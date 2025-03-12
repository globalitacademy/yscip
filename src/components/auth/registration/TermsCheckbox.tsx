
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ checked, onChange }) => {
  return (
    <div className="flex items-center space-x-2 mt-4">
      <Checkbox 
        id="terms" 
        checked={checked}
        onCheckedChange={(checked) => {
          if (typeof checked === 'boolean') {
            onChange(checked);
          }
        }} 
      />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Համաձայն եմ համակարգի{" "}
        <Button variant="link" className="p-0 h-auto text-xs" type="button">
          կանոններին
        </Button>
      </label>
    </div>
  );
};

export default TermsCheckbox;
