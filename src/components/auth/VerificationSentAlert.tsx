
import React from 'react';
import { AlertCircle, Info, Copy } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { UserRole } from '@/data/userRoles';

interface VerificationSentAlertProps {
  role: UserRole;
  verificationToken: string;
  handleResendVerification: () => void;
}

const VerificationSentAlert: React.FC<VerificationSentAlertProps> = ({ 
  role, 
  verificationToken,
  handleResendVerification 
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
        Ձեր էլ․ փոստին ուղարկվել է հաստատման հղում։ Խնդրում ենք ստուգել Ձեր փոստարկղը և սեղմել հղման վրա՝ հաշիվը ակտիվացնելու համար։
        {role !== 'student' && (
          <p className="mt-2 text-amber-600">
            Նշում: {role === 'employer' ? 'Գործատուի' : role === 'lecturer' ? 'Դասախոսի' : 'Ղեկավարի'} հաշիվը պետք է նաև հաստատվի ադմինիստրատորի կողմից ակտիվացումից հետո:
          </p>
        )}
        <div className="mt-4">
          <Button onClick={handleResendVerification} size="sm" variant="outline">
            Վերաուղարկել հաստատման հղումը
          </Button>
        </div>

        {/* Verification Link Display */}
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

export default VerificationSentAlert;
