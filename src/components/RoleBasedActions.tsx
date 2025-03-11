
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, ClipboardList, FileText, LayoutDashboard, Building, BookOpen, GraduationCap, AlertCircle } from 'lucide-react';
import ActionCard from './ActionCard';
import { Button } from './ui/button';

interface RoleBasedActionsProps {
  isAuthenticated: boolean;
  user: any | null;
  isApproved: boolean;
}

const RoleBasedActions: React.FC<RoleBasedActionsProps> = ({ isAuthenticated, user, isApproved }) => {
  // Function to handle reload for error states
  const handleReload = () => {
    window.location.reload();
  };

  // Error state if user is authenticated but no user data is available
  if (isAuthenticated && !user) {
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
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <ActionCard 
          title="Մուտք գործել"
          description="Մուտք գործեք Ձեր հաշիվ"
          icon={<Users className="h-6 w-6 text-primary" />}
          href="/login"
          buttonText="Մուտք"
        />
        <ActionCard 
          title="Նախագծեր"
          description="Դիտել առկա նախագծերը"
          icon={<ClipboardList className="h-6 w-6 text-primary" />}
          href="/"
          buttonText="Դիտել"
        />
        <ActionCard 
          title="Գրանցվել"
          description="Ստեղծել նոր հաշիվ"
          icon={<FileText className="h-6 w-6 text-primary" />}
          href="/login"
          buttonText="Գրանցվել"
        />
      </div>
    );
  }
  
  if (!isApproved && user.role !== 'student') {
    return (
      <div className="mb-10">
        <Card className="bg-amber-50 border-amber-200 text-amber-800">
          <CardContent className="py-6">
            <p className="text-center">Ձեր հաշիվը դեռ սպասում է հաստատման: Դուք կստանաք ծանուցում, երբ այն հաստատվի ադմինիստրատորի կողմից:</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  switch (user.role) {
    case 'admin':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <ActionCard 
            title="Կառավարման վահանակ"
            description="Կառավարել համակարգը"
            icon={<LayoutDashboard className="h-6 w-6 text-primary" />}
            href="/admin"
            buttonText="Մուտք"
          />
          <ActionCard 
            title="Օգտատերեր"
            description="Կառավարել օգտատերերին"
            icon={<Users className="h-6 w-6 text-primary" />}
            href="/users"
            buttonText="Դիտել"
          />
          <ActionCard 
            title="Կազմակերպություններ"
            description="Կառավարել կազմակերպությունները"
            icon={<Building className="h-6 w-6 text-primary" />}
            href="/organizations"
            buttonText="Դիտել"
          />
        </div>
      );
    
    case 'lecturer':
    case 'instructor':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <ActionCard 
            title="Կուրսեր"
            description="Կառավարել կուրսերը"
            icon={<BookOpen className="h-6 w-6 text-primary" />}
            href="/teacher-dashboard"
            buttonText="Մուտք"
          />
          <ActionCard 
            title="Առաջադրանքներ"
            description="Կառավարել առաջադրանքները"
            icon={<ClipboardList className="h-6 w-6 text-primary" />}
            href="/tasks"
            buttonText="Դիտել"
          />
          <ActionCard 
            title="Խմբեր"
            description="Կառավարել խմբերը"
            icon={<Users className="h-6 w-6 text-primary" />}
            href="/groups"
            buttonText="Դիտել"
          />
        </div>
      );
    
    case 'project_manager':
    case 'supervisor':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <ActionCard 
            title="Նախագծեր"
            description="Կառավարել նախագծերը"
            icon={<ClipboardList className="h-6 w-6 text-primary" />}
            href="/project-manager-dashboard"
            buttonText="Մուտք"
          />
          <ActionCard 
            title="Առաջադրանքներ"
            description="Կառավարել առաջադրանքները"
            icon={<FileText className="h-6 w-6 text-primary" />}
            href="/tasks"
            buttonText="Դիտել"
          />
          <ActionCard 
            title="Ժամանակացույց"
            description="Դիտել ժամանակացույցը"
            icon={<LayoutDashboard className="h-6 w-6 text-primary" />}
            href="/gantt"
            buttonText="Դիտել"
          />
        </div>
      );
    
    case 'employer':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <ActionCard 
            title="Իմ նախագծերը"
            description="Դիտել իմ նախագծերը"
            icon={<ClipboardList className="h-6 w-6 text-primary" />}
            href="/employer-dashboard"
            buttonText="Մուտք"
          />
          <ActionCard 
            title="Նախագծի առաջարկ"
            description="Առաջարկել նոր նախագիծ"
            icon={<FileText className="h-6 w-6 text-primary" />}
            href="/projects/submit"
            buttonText="Առաջարկել"
          />
        </div>
      );
    
    case 'student':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <ActionCard 
            title="Նախագծեր"
            description="Դիտել հասանելի նախագծերը"
            icon={<ClipboardList className="h-6 w-6 text-primary" />}
            href="/student-dashboard"
            buttonText="Մուտք"
          />
          <ActionCard 
            title="Պորտֆոլիո"
            description="Կառավարել պորտֆոլիոն"
            icon={<FileText className="h-6 w-6 text-primary" />}
            href="/portfolio"
            buttonText="Դիտել"
          />
        </div>
      );
    
    default:
      return (
        <div className="mb-10">
          <Card className="bg-muted">
            <CardContent className="py-6">
              <p className="text-center">Անհայտ օգտատիրոջ դեր: {user.role}</p>
            </CardContent>
          </Card>
        </div>
      );
  }
};

export default RoleBasedActions;
