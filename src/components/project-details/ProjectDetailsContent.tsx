
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useProject } from '@/contexts/ProjectContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/use-theme';

// Import refactored components
import ProjectHeader from './ProjectHeader';
import ProjectTabs from './ProjectTabs';

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
  const { theme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Պրոեկտը չի գտնվել</h1>
        <Button onClick={() => navigate('/projects')}>Վերադառնալ նախագծերի էջ</Button>
      </div>
    );
  }
  
  // Find similar projects (mock data)
  const similarProjects = project.similarProjects || [];
  
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
  
  const handleSaveChanges = async (updates: Partial<any>) => {
    setIsSaving(true);
    try {
      const success = await updateProject(updates);
      if (!success) {
        throw new Error('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <Header />
      
      <main className="flex-grow">
        {projectStatus === 'rejected' && (
          <div className="container mx-auto px-4 py-2 mt-4">
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Նախագիծը մերժված է</AlertTitle>
              <AlertDescription>
                Ձեր նախագիծը մերժվել է ղեկավարի կողմից։ Խնդրում ենք վերանայել մերժման պատճառները և կապ հաստատել ղեկավարի հետ։
              </AlertDescription>
            </Alert>
          </div>
        )}
          
        {isEditing && (
          <div className="container mx-auto px-4 py-2 mt-4">
            <Alert className={`mb-2 ${
              theme === 'dark' 
                ? 'bg-amber-900/20 border-amber-800/40 text-amber-200' 
                : 'bg-amber-50 border-amber-200 text-amber-800'}`
            }>
              <AlertCircle className={`h-4 w-4 ${theme === 'dark' ? 'text-amber-200' : 'text-amber-500'}`} />
              <AlertTitle>Խմբագրման ռեժիմ</AlertTitle>
              <AlertDescription>
                Դուք կարող եք խմբագրել նախագծի տեքստերն ու նկարները: Բաժինների խմբագրումից հետո սեղմեք համապատասխան պահպանել կոճակները:
              </AlertDescription>
            </Alert>
          </div>
        )}
          
        <ProjectHeader />
          
        <div className="container mx-auto px-4 py-6 max-w-6xl">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectDetailsContent;
