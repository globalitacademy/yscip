
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Copy, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface VerificationAlertProps {
  email: string;
  verificationToken: string;
  onResend: () => void;
}

const VerificationAlert: React.FC<VerificationAlertProps> = ({
  email,
  verificationToken,
  onResend
}) => {
  const copyVerificationLink = () => {
    const link = `${window.location.origin}/verify-email?token=${verificationToken}`;
    navigator.clipboard.writeText(link);
    toast.success('Հաստատման հղումը պատճենված է');
  };

  return (
    <Alert className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Հաստատման հղումն ուղարկված է</AlertTitle>
      <AlertDescription>
        <p>
          Ձեր էլ․ փոստին (<strong>{email}</strong>) ուղարկվել է հաստատման հղում։ Խնդրում ենք ստուգել Ձեր փոստարկղը և սեղմել հղման վրա՝ հաշիվը ակտիվացնելու համար։
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Հաստատման նամակը կարող է հայտնվել նաև «սպամ» կամ «բուլկի» բաժնում։ Եթե նամակը չի հասել 2-3 րոպեի ընթացքում, կարող եք վերաուղարկել այն։
        </p>
        <div className="mt-4">
          <Button onClick={onResend} size="sm" variant="outline">
            Վերաուղարկել հաստատման հղումը
          </Button>
        </div>

        <div className="mt-4 bg-muted p-3 rounded-md">
          <p className="font-medium text-sm flex items-center mb-2">
            <Info size={14} className="mr-1" />
            Դեմո ռեժիմում հաստատեք հաշիվը հետևյալ հղումով:
          </p>
          <div className="flex items-center gap-2">
            <Input 
              readOnly 
              className="text-xs bg-background" 
              value={`${window.location.origin}/verify-email?token=${verificationToken}`}
            />
            <Button size="sm" variant="secondary" onClick={copyVerificationLink}>
              <Copy size={14} />
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default VerificationAlert;
