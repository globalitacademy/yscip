
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, FileText, Users, CheckCircle } from 'lucide-react';
import CreatedProjectsTab from '@/components/tabs/CreatedProjectsTab';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  category: string;
  createdBy: string;
  createdAt: string;
  status?: string;
}

const EmployerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [createdProjects, setCreatedProjects] = useState<Project[]>([]);
  const [completedProjects, setCompletedProjects] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchProjects = async () => {
      if (!user) {
        if (isMounted) setLoading(false);
        return;
      }
      
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }
        
        console.log('Fetching projects for user:', user.id);
        
        const { data, error } = await supabase
          .from('employer_projects')
          .select('*')
          .eq('created_by', user.id);
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Projects data received:', data);
        
        if (isMounted && data) {
          // Convert database format to component format
          const formattedProjects = data.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            techStack: project.tech_stack || [],
            category: project.category,
            createdBy: project.created_by,
            createdAt: project.created_at,
            status: project.status
          }));
          
          setCreatedProjects(formattedProjects);
          
          // Since the status field might not exist yet, default to 0 completed projects
          const completed = data.filter(project => project.status === 'completed').length;
          setCompletedProjects(completed);
        }
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        if (isMounted) {
          setError(error.message || 'Նախագծերը բեռնելիս սխալ առաջացավ։');
          toast.error('Նախագծերը բեռնելիս սխալ առաջացավ։');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchProjects();
    
    return () => {
      isMounted = false;
    };
  }, [user]);
  
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
                <span className="text-2xl font-bold">
                  {loading ? (
                    <span className="inline-block w-6 h-6 rounded-full border-2 border-gray-300 border-t-primary animate-spin"></span>
                  ) : (
                    createdProjects.length
                  )}
                </span>
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
                <span className="text-2xl font-bold">
                  {loading ? (
                    <span className="inline-block w-6 h-6 rounded-full border-2 border-gray-300 border-t-primary animate-spin"></span>
                  ) : (
                    completedProjects
                  )}
                </span>
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
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-primary animate-spin"></div>
              <p className="ml-4 text-lg">Բեռնում...</p>
            </div>
          ) : error ? (
            <div className="text-center p-12 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Փորձել կրկին
              </button>
            </div>
          ) : (
            <CreatedProjectsTab user={user} createdProjects={createdProjects} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmployerDashboard;
