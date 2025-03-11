
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, FileText, Users, CheckCircle } from 'lucide-react';
import CreatedProjectsTab from '@/components/tabs/CreatedProjectsTab';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const EmployerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [createdProjects, setCreatedProjects] = useState<any[]>([]);
  const [completedProjects, setCompletedProjects] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Fetch real data from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Query the employer_projects table
        const { data, error } = await supabase
          .from('employer_projects')
          .select('*')
          .eq('created_by', user.id);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Convert database format to component format
          const formattedProjects = data.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            techStack: project.tech_stack || [],
            category: project.category,
            createdBy: project.created_by,
            createdAt: project.created_at
          }));
          
          setCreatedProjects(formattedProjects);
          
          // For now, just set a mock completed count
          // In a real app, you might have a status field to count completed projects
          setCompletedProjects(1);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Նախագծերը բեռնելիս սխալ առաջացավ։');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
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
                <span className="text-2xl font-bold">{loading ? '...' : createdProjects.length}</span>
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
                <span className="text-2xl font-bold">{loading ? '...' : completedProjects}</span>
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
              <p>Բեռնում...</p>
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
