
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Users, Calendar, CheckCircle } from 'lucide-react';
import { ProjectTheme } from '@/data/projectThemes';
import { getStudentsForProject } from '@/data/userRoles';
import { supabase } from '@/integrations/supabase/client';

interface ProjectProposal {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  duration?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  employer_id: string;
  organization?: string;
  feedback?: string;
}

const MyProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const [approvedProposals, setApprovedProposals] = useState<ProjectProposal[]>([]);
  const [projectThemes, setProjectThemes] = useState<ProjectTheme[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchApprovedProposals = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch approved proposals from Supabase
        const { data, error } = await supabase
          .from('project_proposals')
          .select('*')
          .eq('employer_id', user.id)
          .eq('status', 'approved');
          
        if (error) {
          console.error('Error fetching approved proposals:', error);
          throw error;
        }
        
        setApprovedProposals(data || []);
        
        // Load project themes from localStorage or fall back to imported data
        try {
          const savedThemes = localStorage.getItem('projectThemes');
          if (savedThemes) {
            const themes = JSON.parse(savedThemes);
            // Filter only this employer's projects
            const employerProjects = themes.filter((theme: ProjectTheme) => 
              theme.createdBy === user.id
            );
            setProjectThemes(employerProjects);
          }
        } catch (e) {
          console.error('Error loading project themes:', e);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApprovedProposals();
  }, [user]);
  
  if (loading) {
    return (
      <AdminLayout pageTitle="Իմ նախագծերը">
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-medium">Տվյալները բեռնվում են...</p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }
  
  if (approvedProposals.length === 0 && projectThemes.length === 0) {
    return (
      <AdminLayout pageTitle="Իմ նախագծերը">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Դեռևս նախագծեր չկան</AlertTitle>
          <AlertDescription>
            Ձեր ոչ մի նախագծի առաջարկ դեռ չի հաստատվել։ Հաստատված առաջարկները կհայտնվեն այստեղ։
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout pageTitle="Իմ նախագծերը">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Approved proposals */}
        {approvedProposals.map((project) => (
          <Card key={`proposal-${project.id}`} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                  <CardDescription>Առաջարկ #{project.id.substring(0, 8)}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Հաստատված
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {project.description}
              </p>
              
              {project.requirements && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground">Տեխնիկական պահանջներ:</p>
                  <p className="text-sm">{project.requirements}</p>
                </div>
              )}
              
              {project.duration && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{project.duration}</span>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button className="w-full">Դիտել մանրամասներ</Button>
            </CardFooter>
          </Card>
        ))}
        
        {/* Active projects */}
        {projectThemes.map((project) => {
          const assignedStudents = getStudentsForProject(project.id);
          
          return (
            <Card key={`project-${project.id}`} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                    <CardDescription>Նախագիծ #{project.id}</CardDescription>
                  </div>
                  <Badge className="bg-primary/10 text-primary">Ակտիվ</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{assignedStudents.length} ուսանող</span>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full">Դիտել մանրամասներ</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default MyProjectsPage;
