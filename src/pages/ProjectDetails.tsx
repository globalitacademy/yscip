
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectThemes } from '@/data/projectThemes';
import { ProjectProvider } from '@/contexts/ProjectContext';
import ProjectDetailsContent from '@/components/project-details/ProjectDetailsContent';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { loadProjectReservations } from '@/utils/projectUtils';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const projectId = id ? parseInt(id) : null;
  const project = projectThemes.find(p => p.id === projectId) || null;
  
  // Check if this supervisor has pending approvals for this project
  const hasPendingApprovals = () => {
    if (!user || !projectId || (user.role !== 'supervisor' && user.role !== 'project_manager')) {
      return false;
    }
    
    const reservations = loadProjectReservations();
    return reservations.some(
      res => res.projectId === projectId && res.supervisorId === user.id && res.status === 'pending'
    );
  };
  
  useEffect(() => {
    if (!project && projectId) {
      toast({
        title: "Նախագիծը չի գտնվել",
        description: "Նշված նախագիծը չի գտնվել։ Դուք կվերահղվեք նախագծերի էջ։",
        variant: "destructive",
      });
      
      // Redirect to projects page after 3 seconds
      const timeout = setTimeout(() => {
        navigate('/projects');
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [project, projectId, navigate]);
  
  // Show notification for supervisors if they have pending approvals
  useEffect(() => {
    if (hasPendingApprovals()) {
      toast({
        title: "Հաստատման հարցում",
        description: "Այս նախագծի համար կա հաստատման սպասող հարցում։",
      });
    }
  }, [user, projectId]);
  
  if (!projectId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-4">Անվավեր նախագծի ID</h1>
        <p className="text-muted-foreground mb-8">Խնդրում ենք ստուգել URL-ը և փորձել կրկին</p>
        <button 
          onClick={() => navigate('/projects')}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          Վերադառնալ նախագծերի էջ
        </button>
      </div>
    );
  }
  
  // Show loading skeleton while data is being fetched (simulating network request)
  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <Skeleton className="h-6 w-32 mb-3" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-6" />
            <div className="flex flex-wrap gap-3 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-48 mt-2" />
          </div>
          <Skeleton className="h-64 w-full md:h-auto" />
        </div>
      </div>
    );
  }

  // Display approval notification for supervisors
  const pendingApprovalAlert = hasPendingApprovals() && (
    <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-800">
      <AlertCircle className="h-4 w-4 text-amber-800" />
      <AlertTitle>Հաստատման հարցում</AlertTitle>
      <AlertDescription>
        Ուսանողը հարցում է ուղարկել այս նախագծի համար։ Խնդրում ենք հաստատել կամ մերժել այն ադմինիստրատիվ վահանակից։
      </AlertDescription>
    </Alert>
  );
  
  return (
    <ProjectProvider projectId={projectId} initialProject={project}>
      {pendingApprovalAlert}
      <ProjectDetailsContent />
    </ProjectProvider>
  );
};

export default ProjectDetails;
