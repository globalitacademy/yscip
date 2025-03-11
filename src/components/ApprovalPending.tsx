
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Clock } from 'lucide-react';

const ApprovalPending: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleTranslation = (role: string) => {
    switch (role) {
      case 'admin': return 'ադմինիստրատոր';
      case 'lecturer': return 'դասախոս';
      case 'instructor': return 'դասախոս';
      case 'project_manager': return 'պրոյեկտի ղեկավար';
      case 'supervisor': return 'ղեկավար';
      case 'employer': return 'գործատու';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold mt-4">Հաստատման սպասում</CardTitle>
          <CardDescription>
            Ձեր {user?.role ? getRoleTranslation(user.role) : ''} հաշիվը դեռ սպասում է հաստատման
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Ադմինիստրատորը պետք է հաստատի Ձեր հաշիվը նախքան Դուք կկարողանաք օգտվել համակարգից:</p>
            <p className="mt-2">Խնդրում ենք սպասել մինչև հաշիվը հաստատվի կամ կապվել ադմինիստրատորի հետ:</p>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={handleLogout}
          >
            Դուրս գալ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalPending;
