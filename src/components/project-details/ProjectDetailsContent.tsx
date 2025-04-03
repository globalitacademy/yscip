
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
    setIsEditing
  } = useProject();
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
    name: 'Պլեքկոդ',
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {canEdit && (
          <div className="container mx-auto px-4 py-2 flex justify-end">
            <Button 
              variant={isEditing ? "destructive" : "default"}
              size="sm" 
              onClick={handleToggleEditing}
              className="mb-2"
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
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Նախագիծը մերժված է</AlertTitle>
              <AlertDescription>
                Ձեր նախագիծը մերժվել է ղեկավարի կողմից։ Խնդրում ենք վերանայել մերժման պատճառները և կապ հաստատել ղեկավարի հետ։
              </AlertDescription>
            </Alert>
          )}
          
          {isEditing && (
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertTitle>Խմբագրման ռեժիմ</AlertTitle>
              <AlertDescription>
                Դուք կարող եք խմբագրել նախագծի տեքստերն ու նկարները: Պարզապես սեղմեք համապատասխան դաշտերի վրա և կատարեք փոփոխությունները: 
                Ավարտելուց հետո անպայման սեղմեք պահպանել կոճակը:
              </AlertDescription>
            </Alert>
          )}
          
          <ProjectHeader 
            project={project}
            projectStatus={projectStatus}
            isReserved={isReserved}
            imageUrl={imageUrl}
            projectMembers={projectMembers}
            organization={organization}
            progressPercentage={projectProgress}
          />
          
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
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectDetailsContent;
