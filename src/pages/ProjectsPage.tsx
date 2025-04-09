
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProjectManagementProvider } from '@/contexts/ProjectManagementContext';
import ThemeGrid from '@/components/ThemeGrid';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-background text-foreground' : 'bg-white text-gray-900'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="mb-8 flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Գլխավոր էջ
          </Button>
          <h1 className="text-3xl font-bold">Նախագծերի թեմաներ</h1>
        </div>
        
        <div className="mb-6">
          <p className="text-muted-foreground max-w-2xl">
            Բոլոր հասանելի նախագծերի և թեմաների ցանկ։ Օգտագործեք փնտրման և ֆիլտրման գործիքները՝ ձեզ հետաքրքրող նախագծերը գտնելու համար։
          </p>
        </div>
        
        <ProjectManagementProvider>
          <ThemeGrid />
        </ProjectManagementProvider>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectsPage;
