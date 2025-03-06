
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { FadeIn } from '@/components/LocalTransitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from '@/components/UserManagement';
import ProjectCreation from '@/components/ProjectCreation';
import { Users, FileText, BookOpen } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [createdProjects, setCreatedProjects] = useState<any[]>([]);

  const handleProjectCreated = (project: any) => {
    setCreatedProjects(prev => [...prev, project]);
  };

  if (!user || (user.role !== 'admin' && user.role !== 'supervisor' && user.role !== 'instructor')) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">Մուտքն արգելված է</h1>
            <p className="text-muted-foreground">
              Դուք չունեք այս էջ մտնելու համար անհրաժեշտ իրավունքներ։
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <FadeIn>
            <h1 className="text-3xl font-bold mb-2">Կառավարման վահանակ</h1>
            <p className="text-muted-foreground mb-8">
              Կառավարեք համակարգի օգտատերերին, դասընթացները և պրոեկտները։
            </p>
            
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto mb-8">
                <TabsTrigger value="users" className="flex items-center gap-2" disabled={user.role !== 'admin'}>
                  <Users size={16} /> Օգտատերերի կառավարում
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <FileText size={16} /> Պրոեկտների ստեղծում
                </TabsTrigger>
                <TabsTrigger value="assignments" className="flex items-center gap-2">
                  <BookOpen size={16} /> Պրոեկտների նշանակում
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
              
              <TabsContent value="projects">
                <ProjectCreation onProjectCreated={handleProjectCreated} />
              </TabsContent>
              
              <TabsContent value="assignments">
                <div className="bg-accent/20 rounded-lg p-8 text-center">
                  <h3 className="text-xl font-medium mb-2">Պրոեկտների նշանակում</h3>
                  <p className="text-muted-foreground">
                    Այս բաժինը դեռևս մշակման փուլում է։ Խնդրում ենք փորձել ավելի ուշ։
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </FadeIn>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
