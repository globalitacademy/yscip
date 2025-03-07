
import React from 'react';
import { Button } from '@/components/ui/button';
import { Info, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface DeveloperInfoProps {
  showDeveloperInfo: boolean;
  onToggleDeveloperInfo: () => void;
  pendingUsers: any[];
}

const DeveloperInfo: React.FC<DeveloperInfoProps> = ({ 
  showDeveloperInfo, 
  onToggleDeveloperInfo, 
  pendingUsers 
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

          <p className="text-sm text-muted-foreground mb-2">Սպասման մեջ գտնվող օգտատերեր՝</p>
          <div className="max-h-40 overflow-auto text-xs">
            {pendingUsers.length === 0 ? (
              <p className="text-muted-foreground">Չկան սպասման մեջ գտնվող օգտատերեր</p>
            ) : (
              <ul className="space-y-2">
                {pendingUsers.map((user, index) => (
                  <li key={index} className="p-2 bg-muted rounded-md">
                    <div><strong>Անուն:</strong> {user.name}</div>
                    <div><strong>Էլ․ հասցե:</strong> {user.email}</div>
                    <div><strong>Դերակատարում:</strong> {user.role}</div>
                    <div><strong>Հաստատված:</strong> {user.verified ? 'Այո' : 'Ոչ'}</div>
                    <div><strong>Թույլատրված:</strong> {user.registrationApproved ? 'Այո' : 'Ոչ'}</div>
                    <div className="flex items-center">
                      <strong>Հաստատման հղում:</strong>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 px-2 ml-1"
                        onClick={() => {
                          const link = `${window.location.origin}/verify-email?token=${user.verificationToken}`;
                          navigator.clipboard.writeText(link);
                          toast.success('Հաստատման հղումը պատճենված է');
                        }}
                      >
                        <Copy size={12} />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DeveloperInfo;
