
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { UserRole } from '@/data/userRoles';

interface DemoAccountsProps {
  onQuickLogin: (role: UserRole) => void;
}

const DemoAccounts: React.FC<DemoAccountsProps> = ({ onQuickLogin }) => {
  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Դեմո հաշիվներ</AlertTitle>
        <AlertDescription>
          Ուսումնական նպատակներով կարող եք օգտագործել հետևյալ հաշիվները
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 gap-3">
        <DemoAccountCard
          title="Ադմինիստրատոր"
          credentials="admin@example.com / password"
          role="admin"
          onQuickLogin={onQuickLogin}
        />
        
        <DemoAccountCard
          title="Դասախոս"
          credentials="lecturer@example.com / password"
          role="lecturer"
          onQuickLogin={onQuickLogin}
        />
        
        <DemoAccountCard
          title="Ուսանող"
          credentials="student@example.com / password"
          role="student"
          onQuickLogin={onQuickLogin}
        />
        
        <DemoAccountCard
          title="Նախագծի ղեկավար"
          credentials="manager@example.com / password"
          role="project_manager"
          onQuickLogin={onQuickLogin}
        />
        
        <DemoAccountCard
          title="Գործատու"
          credentials="employer@example.com / password"
          role="employer"
          onQuickLogin={onQuickLogin}
        />
      </div>
    </div>
  );
};

interface DemoAccountCardProps {
  title: string;
  credentials: string;
  role: UserRole;
  onQuickLogin: (role: UserRole) => void;
}

const DemoAccountCard: React.FC<DemoAccountCardProps> = ({
  title,
  credentials,
  role,
  onQuickLogin
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <Button variant="outline" size="sm" onClick={() => onQuickLogin(role)}>
            Արագ մուտք
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm text-muted-foreground">
          {credentials}
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoAccounts;
