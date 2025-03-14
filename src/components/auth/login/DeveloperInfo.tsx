
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertCircle } from 'lucide-react';
import AdminReset from '@/components/AdminReset';

const DeveloperInfo: React.FC = () => {
  const [showDeveloperInfo, setShowDeveloperInfo] = useState(false);

  return (
    <>
      <div className="mt-4">
        <Button 
          variant="link" 
          className="p-0 text-xs text-muted-foreground"
          onClick={() => setShowDeveloperInfo(!showDeveloperInfo)}
        >
          {showDeveloperInfo ? 'Թաքցնել մշակողի տեղեկատվությունը' : 'Ցուցադրել մշակողի տեղեկատվությունը'}
        </Button>
      </div>

      {showDeveloperInfo && (
        <div className="mt-4 p-4 border rounded-md bg-muted/50">
          <h3 className="font-medium mb-2 flex items-center gap-1">
            <Info size={16} />
            Մշակողի գործիքակազմ
          </h3>
          
          <Alert className="mb-3">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ադմինիստրատորի հաշիվ</AlertTitle>
            <AlertDescription>
              <p className="mt-2 text-sm text-muted-foreground">
                Ադմինիստրատորի հաշիվն ունի բոլոր թույլտվությունները և կարող է հաստատել նոր օգտատերերի
              </p>
            </AlertDescription>
          </Alert>
          
          <AdminReset />
        </div>
      )}
    </>
  );
};

export default DeveloperInfo;
