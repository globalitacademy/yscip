
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectThemes } from '@/data/projectThemes';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProjectTheme } from '@/data/projectThemes';
import { useToast } from '@/components/ui/use-toast';
import { updateProject } from '@/services/projectService';
import ProjectCreationForm from '@/components/project-creation/ProjectCreationForm';

const ProjectEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<ProjectTheme | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
          navigate('/projects');
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
  }, [id, navigate, toast]);

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
        navigate(`/project/${projectId}`);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Նախագիծը չի գտնվել</h1>
          <button 
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            Վերադառնալ նախագծերի էջ
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{project.title} - Խմբագրում</h1>
        <ProjectCreationForm 
          initialData={project} 
          onProjectCreated={handleProjectUpdated}
          isEditing={true} 
        />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectEditPage;
