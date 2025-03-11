
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, FileText, Users, CheckCircle } from 'lucide-react';
import CreatedProjectsTab from '@/components/tabs/CreatedProjectsTab';
import { useAuth } from '@/contexts/auth';

const EmployerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [createdProjects, setCreatedProjects] = useState<any[]>([]);
  
  // Fetch or mock the created projects data
  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    // For now, we'll use mock data
    const mockProjects = [
      {
        id: '1',
        title: 'Էլեկտրոնային առևտրի հարթակ',
        description: 'Ստեղծել վեբ հավելված ապրանքների առցանց վաճառքի համար, ներառյալ վճարման համակարգ և պատվերների կառավարում։',
        techStack: ['React', 'Node.js', 'MongoDB'],
        category: 'Էլեկտրոնային առևտուր',
        createdBy: user?.id
      },
      {
        id: '2',
        title: 'Մոբայլ բանկինգ հավելված',
        description: 'Մշակել մոբայլ հավելված` բանկային գործառնությունների կառավարման համար, անվտանգության բարձր մակարդակով։',
        techStack: ['Flutter', 'Firebase', 'REST API'],
        category: 'Ֆինտեխ',
        createdBy: user?.id
      },
      {
        id: '3',
        title: 'Առաքման ծառայություն',
        description: 'Ստեղծել համակարգ առաքման պատվերների հետևման և կառավարման համար։',
        techStack: ['React Native', 'GraphQL', 'PostgreSQL'],
        category: 'Լոջիստիկա',
        createdBy: user?.id
      }
    ];
    
    setCreatedProjects(mockProjects);
  }, [user?.id]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Գործատուի վահանակ</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Իմ նախագծերը</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{createdProjects.length}</span>
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ավարտված</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">1</span>
                <CheckCircle className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ուսանողներ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">8</span>
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Կազմակերպություն</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{user?.organization || "N/A"}</span>
                <Building className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Իմ նախագծերը</h2>
          <CreatedProjectsTab user={user} createdProjects={createdProjects} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmployerDashboard;
