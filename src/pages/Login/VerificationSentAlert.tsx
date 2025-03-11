
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { UserRole } from '@/types/database.types';

interface VerificationSentAlertProps {
  role: UserRole;
}

const VerificationSentAlert: React.FC<VerificationSentAlertProps> = ({ role }) => {
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
      </AlertDescription>
    </Alert>
  );
};

export default VerificationSentAlert;
