
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectThemes } from '@/data/projectThemes';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminLayout from '@/components/AdminLayout';
import { ProjectTheme } from '@/data/projectThemes';
import { useToast } from '@/components/ui/use-toast';
import { updateProject } from '@/services/projectService';
import ProjectCreationForm from '@/components/project-creation/ProjectCreationForm';
import { ProjectManagementProvider } from '@/contexts/ProjectManagementContext';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProjectEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<ProjectTheme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");

  // Check if we're in admin mode based on the URL path
  const isAdminMode = location.pathname.includes('/admin/') || location.pathname.includes('/projects/edit/');

  // Check if user has edit permissions
  const canEditProject = user && (
    user.role === 'admin' || 
    user.role === 'lecturer' || 
    user.role === 'employer'
  );

  useEffect(() => {
    // Redirect if user doesn't have permission
    if (user && !canEditProject) {
      toast({
        title: "Մուտքն արգելված է",
        description: "Դուք չունեք նախագծերը խմբագրելու իրավունք։",
        variant: "destructive",
      });
      navigate(`/project/${id}`);
      return;
    }

    const fetchProject = async () => {
      setIsLoading(true);
      
      try {
        // For temporary purposes, use projectThemes array to find the project
        const projectId = id ? parseInt(id) : null;
        const foundProject = projectThemes.find(p => p.id === projectId);
        
        if (!foundProject) {
          toast({
            title: "Նախագիծը չի գտնվել",
            description: "Նշված նախագիծը չի գտնվել։",
            variant: "destructive",
          });
          navigate(isAdminMode ? '/admin/projects' : '/projects');
          return;
        }
        
        setProject(foundProject);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Սխալ",
          description: "Նախագծի տվյալները հնարավոր չէ ստանալ։",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate, toast, user, canEditProject, isAdminMode]);

  const handleProjectUpdated = async (updatedProject: ProjectTheme) => {
    try {
      // Handle project update logic
      if (!id) {
        throw new Error("Missing project ID");
      }
      
      const projectId = parseInt(id);
      
      // Use the updateProject service to save the changes
      const success = await updateProject(projectId, {
        ...updatedProject,
        updatedAt: new Date().toISOString()
      });
      
      if (success) {
        toast({
          title: "Նախագիծը թարմացվել է",
          description: "Նախագծի փոփոխությունները հաջողությամբ պահպանվել են։",
        });
        navigate(isAdminMode ? '/admin/projects' : `/project/${projectId}`);
      } else {
        throw new Error("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Սխալ",
        description: "Նախագծի թարմացման ժամանակ սխալ է տեղի ունեցել։",
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        </div>
      );
    }

    if (!project) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Նախագիծը չի գտնվել</h1>
          <Button 
            onClick={() => navigate(isAdminMode ? '/admin/projects' : '/projects')}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            Վերադառնալ նախագծերի էջ
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(isAdminMode ? '/admin/projects' : '/projects')}
            className="text-sm flex items-center gap-1"
          >
            <ArrowLeft size={16} /> Վերադառնալ նախագծերի ցանկ
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">{project.title} - Խմբագրում</h1>
        
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">Հիմնական տվյալներ</TabsTrigger>
            <TabsTrigger value="details">Մանրամասներ</TabsTrigger>
            <TabsTrigger value="tech">Տեխնոլոգիաներ</TabsTrigger>
            <TabsTrigger value="implementation">Իրականացում</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="pt-4">
            <ProjectCreationForm 
              initialData={project} 
              onProjectCreated={handleProjectUpdated}
              isEditing={true}
              startStep={1}
            />
          </TabsContent>
          
          <TabsContent value="details" className="pt-4">
            <ProjectCreationForm 
              initialData={project} 
              onProjectCreated={handleProjectUpdated}
              isEditing={true}
              startStep={2}
            />
          </TabsContent>
          
          <TabsContent value="tech" className="pt-4">
            <ProjectCreationForm 
              initialData={project} 
              onProjectCreated={handleProjectUpdated}
              isEditing={true}
              startStep={3}
            />
          </TabsContent>
          
          <TabsContent value="implementation" className="pt-4">
            <ProjectCreationForm 
              initialData={project} 
              onProjectCreated={handleProjectUpdated}
              isEditing={true}
              startStep={4}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // Render with different layouts depending on if we're in admin mode
  if (isAdminMode) {
    return (
      <AdminLayout pageTitle="Նախագծի խմբագրում">
        <ProjectManagementProvider>
          {renderContent()}
        </ProjectManagementProvider>
      </AdminLayout>
    );
  }

  return (
    <ProjectManagementProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </ProjectManagementProvider>
  );
};

export default ProjectEditPage;
