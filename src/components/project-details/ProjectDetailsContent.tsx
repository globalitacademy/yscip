
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useProject } from '@/contexts/ProjectContext';
import { projectThemes } from '@/data/projectThemes';
import { getProjectImage } from '@/lib/getProjectImage';
import { toast } from 'sonner';  
import ProjectHeader from './ProjectHeader';
import ProjectTabs from './ProjectTabs';
import { cn } from '@/lib/utils';
import { AlertCircle, Edit, Save, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

const ProjectDetailsContent: React.FC = () => {
  const { 
    project, 
    timeline, 
    tasks, 
    projectStatus, 
    addTimelineEvent, 
    completeTimelineEvent, 
    addTask, 
    updateTaskStatus, 
    submitProject, 
    approveProject, 
    rejectProject,
    isReserved,
    projectProgress,
    canEdit,
    isEditing,
    setIsEditing,
    updateProject
  } = useProject();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Պրոեկտը չի գտնվել</h1>
        <Button onClick={() => navigate('/projects')}>Վերադառնալ նախագծերի էջ</Button>
      </div>
    );
  }
  
  const similarProjects = projectThemes
    .filter(p => p.id !== project?.id && 
      (p.category === project?.category || 
       p.techStack.some(tech => project?.techStack.includes(tech))))
    .slice(0, 3);
  
  const imageUrl = getProjectImage(project);

  // Mock data for the project members
  const projectMembers = [
    { id: 'supervisor1', name: 'Արամ Հակոբյան', role: 'ղեկավար', avatar: '/placeholder.svg' },
    { id: 'student1', name: 'Գագիկ Պետրոսյան', role: 'ուսանող', avatar: '/placeholder.svg' }
  ];

  // Mock data for organization
  const organization = {
    id: 'org1',
    name: project.organizationName || 'Պլեքկոդ',
    website: 'https://plexcode.am',
    logo: '/placeholder.svg'
  };
  
  const handleToggleEditing = () => {
    if (isEditing) {
      setIsEditing(false);
      toast.success('Խմբագրման ռեժիմը անջատված է');
    } else {
      setIsEditing(true);
      toast.success('Խմբագրման ռեժիմը միացված է');
    }
  };

  const handleSaveChanges = async (updates: Partial<any>) => {
    setIsSaving(true);
    try {
      const success = await updateProject(updates);
      if (success) {
        toast.success('Փոփոխությունները հաջողությամբ պահպանվել են');
      } else {
        toast.error('Փոփոխությունների պահպանման ժամանակ սխալ է տեղի ունեցել');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Փոփոխությունների պահպանման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-grow">
        {canEdit && (
          <div className="container mx-auto px-4 py-2 flex justify-end">
            <Button 
              variant={isEditing ? "destructive" : "default"}
              size="sm" 
              onClick={handleToggleEditing}
              className={cn(
                "mb-2 transition-all duration-200",
                isEditing ? "shadow-md" : "shadow hover:shadow-md"
              )}
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-1.5" />
                  Դուրս գալ խմբագրման ռեժիմից
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-1.5" />
                  Խմբագրել նախագիծը
                </>
              )}
            </Button>
          </div>
        )}
        
        <div className="container px-4 mx-auto py-8 max-w-6xl">
          {projectStatus === 'rejected' && (
            <Alert variant="destructive" className="mb-6 animate-fade-in">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Նախագիծը մերժված է</AlertTitle>
              <AlertDescription>
                Ձեր նախագիծը մերժվել է ղեկավարի կողմից։ Խնդրում ենք վերանայել մերժման պատճառները և կապ հաստատել ղեկավարի հետ։
              </AlertDescription>
            </Alert>
          )}
          
          {isEditing && (
            <Alert className="mb-6 border-amber-200 bg-amber-50 animate-fade-in">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertTitle>Խմբագրման ռեժիմ</AlertTitle>
              <AlertDescription>
                Դուք կարող եք խմբագրել նախագծի տեքստերն ու նկարները: Պարզապես սեղմեք համապատասխան դաշտերի վրա և կատարեք փոփոխությունները: 
                Ավարտելուց հետո անպայման սեղմեք պահպանել կոճակը:
              </AlertDescription>
            </Alert>
          )}
          
          <ProjectHeader />
          
          <div className="mt-8 bg-card rounded-xl shadow-lg border border-border/50 p-6 animate-fade-in">
            <ProjectTabs 
              project={project}
              timeline={timeline}
              tasks={tasks}
              projectStatus={projectStatus}
              isReserved={isReserved}
              projectMembers={projectMembers}
              organization={organization}
              similarProjects={similarProjects}
              addTimelineEvent={addTimelineEvent}
              completeTimelineEvent={completeTimelineEvent}
              addTask={addTask}
              updateTaskStatus={updateTaskStatus}
              submitProject={submitProject}
              approveProject={approveProject}
              rejectProject={rejectProject}
              isEditing={isEditing}
              onSaveChanges={handleSaveChanges}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectDetailsContent;
