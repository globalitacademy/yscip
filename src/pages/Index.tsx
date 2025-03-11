
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Building, ClipboardList, FileText, GraduationCap, LayoutDashboard, LucideIcon, Users } from 'lucide-react';
import { ThemeGrid } from '@/components/ThemeGrid';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProjectGrid } from '@/components/project/ProjectGrid';
import Hero from '@/components/Hero';
import { LocalTransitions } from '@/components/LocalTransitions';
import { useAuth } from '@/contexts/auth';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  buttonText: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, href, buttonText }) => (
  <Card className="flex flex-col h-full">
    <CardHeader>
      <div className="p-2 bg-primary/10 w-fit rounded-md mb-2">
        {icon}
      </div>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
    </CardContent>
    <CardFooter>
      <Link to={href} className="w-full">
        <Button className="w-full">
          {buttonText} <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

const Index: React.FC = () => {
  const { user, isAuthenticated, isApproved } = useAuth();
  
  // Get role-based actions based on user role
  const getRoleBasedActions = () => {
    if (!isAuthenticated || !user) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
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
            <CardContent className="pt-6">
              <p className="text-center">Ձեր հաշիվը դեռ սպասում է հաստատման: Դուք կստանաք ծանուցում, երբ այն հաստատվի ադմինիստրատորի կողմից:</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    switch (user.role) {
      case 'admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <ActionCard 
              title="Կուրսեր"
              description="Կառավարել կուրսերը"
              icon={<BookOpen className="h-6 w-6 text-primary" />}
              href="/courses"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <ActionCard 
              title="Նախագծեր"
              description="Կառավարել նախագծերը"
              icon={<ClipboardList className="h-6 w-6 text-primary" />}
              href="/projects/manage"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <ActionCard 
              title="Իմ նախագծերը"
              description="Դիտել իմ նախագծերը"
              icon={<ClipboardList className="h-6 w-6 text-primary" />}
              href="/projects/my"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <ActionCard 
              title="Նախագծեր"
              description="Դիտել հասանելի նախագծերը"
              icon={<ClipboardList className="h-6 w-6 text-primary" />}
              href="/projects"
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
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <div className="relative">
          <Hero />
          <div className="w-full absolute bottom-0 left-0">
            <ThemeGrid />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <LocalTransitions>
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Ձեր դաշբորդը</h2>
              {getRoleBasedActions()}
            </div>
            
            <h2 className="text-3xl font-bold mb-6">Նախագծեր</h2>
            <ProjectGrid />
          </LocalTransitions>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
