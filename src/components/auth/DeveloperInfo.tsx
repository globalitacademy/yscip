
import React from 'react';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

interface DeveloperInfoProps {
  showDeveloperInfo: boolean;
  onToggleDeveloperInfo: () => void;
}

const DeveloperInfo: React.FC<DeveloperInfoProps> = ({ 
  showDeveloperInfo, 
  onToggleDeveloperInfo
}) => {
  return (
    <>
      <div className="mt-4">
        <Button 
          variant="link" 
          className="p-0 text-xs text-muted-foreground"
          onClick={onToggleDeveloperInfo}
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
          
          <p className="text-sm text-muted-foreground mb-2">Սուպերադմինի հաշիվ՝</p>
          <div className="text-sm bg-muted p-2 rounded-md mb-3">
            <div><strong>Էլ․ հասցե:</strong> superadmin@example.com</div>
            <div><strong>Գաղտնաբառ:</strong> SuperAdmin123</div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeveloperInfo;
