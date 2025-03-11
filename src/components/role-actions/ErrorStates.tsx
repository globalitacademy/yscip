
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const UserDataError: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="mb-10">
      <Card className="bg-destructive/10 border-destructive/20 text-destructive">
        <CardContent className="py-6 flex flex-col items-center">
          <AlertCircle className="h-12 w-12 mb-4 text-destructive" />
          <p className="text-center mb-4">Օգտատիրոջ տվյալները հասանելի չեն: Խնդրում ենք կրկին փորձել:</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={handleReload}
          >
            Թարմացնել էջը
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const PendingApproval: React.FC = () => (
  <div className="mb-10">
    <Card className="bg-amber-50 border-amber-200 text-amber-800">
      <CardContent className="py-6">
        <p className="text-center">Ձեր հաշիվը դեռ սպասում է հաստատման: Դուք կստանաք ծանուցում, երբ այն հաստատվի ադմինիստրատորի կողմից:</p>
      </CardContent>
    </Card>
  </div>
);
