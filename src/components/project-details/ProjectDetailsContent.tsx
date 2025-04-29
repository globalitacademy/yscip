import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';
import { AlertCircle, Tag, Clock, CalendarRange, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import FloatingActionButton from './FloatingActionButton';
import ProjectBanner from './ProjectBanner';
import ProjectDescription from './ProjectDescription';
import ProjectTimeline from './ProjectTimeline';
import ProjectTasks from './ProjectTasks';
import ProjectDiscussions from './ProjectDiscussions';
import ProjectFiles from './ProjectFiles';
import ProjectEvaluation from './ProjectEvaluation';
import { TaskStatus } from '@/utils/taskUtils';

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
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-4">Պրոեկտը չի գտնվել</h1>
        <Button onClick={() => navigate('/projects')}>Վերադառնալ նախագծերի էջ</Button>
      </div>
    );
  }
  
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

  // Generate similar projects data
  const similarProjects = project.category ? 
    Array.from({ length: 3 }).map((_, i) => ({
      ...project,
      id: project.id + (i + 100),
      title: `Նմանատիպ պրոեկտ ${i + 1}`,
    })) : [];

  const handleSaveChanges = async (updates: Partial<any>) => {
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
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-background to-background/80">
        <ProjectBanner project={project} isEditing={isEditing} onSaveChanges={handleSaveChanges} />
        
        <div className="container mx-auto px-4 py-8">
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
            <Alert className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700/30 dark:text-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              <AlertTitle>Խմբագրման ռեժիմ</AlertTitle>
              <AlertDescription className="dark:text-amber-300/80">
                Դուք կարող եք խմբագրել նախագծի տեքստերն ու նկարները: Պարզապես սեղմեք համապատասխան դաշտերի վրա և կատարեք փոփոխությունները: 
                Ավարտելուց հետո անպայման սեղմեք պահպանել կոճակը:
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5">
                  <Tag className="h-3.5 w-3.5" /> 
                  {project.category}
                </Badge>
                {project.duration && (
                  <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5">
                    <Clock className="h-3.5 w-3.5" /> 
                    {project.duration}
                  </Badge>
                )}
                {projectStatus && (
                  <Badge 
                    className={cn(
                      "px-3 py-1.5",
                      projectStatus === 'approved' && "bg-green-600",
                      projectStatus === 'pending' && "bg-amber-600",
                      projectStatus === 'rejected' && "bg-red-600",
                      projectStatus === 'not_submitted' && "bg-blue-600"
                    )}
                  >
                    {projectStatus === 'approved' && "Հաստատված"}
                    {projectStatus === 'pending' && "Սպասում է"}
                    {projectStatus === 'rejected' && "Մերժված"}
                    {projectStatus === 'not_submitted' && "Չի ներկայացվել"}
                  </Badge>
                )}
                {isReserved && (
                  <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
                    <Users className="h-3.5 w-3.5" /> 
                    Ամրագրված
                  </Badge>
                )}
              </div>
              
              {projectProgress > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Առաջընթաց:</span>
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${projectProgress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{projectProgress}%</span>
                </div>
              )}
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto rounded-xl bg-muted/50 p-1 mb-8">
              <TabsTrigger value="overview">Նկարագիր</TabsTrigger>
              <TabsTrigger value="timeline">Ժամանակացույց</TabsTrigger>
              <TabsTrigger value="tasks">Քայլեր</TabsTrigger>
              <TabsTrigger value="discussions">Քննարկումներ</TabsTrigger>
              <TabsTrigger value="files">Ֆայլեր</TabsTrigger>
              <TabsTrigger value="evaluation">Գնահատական</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="animate-in fade-in-50 slide-in-from-bottom-3">
              <ProjectDescription 
                project={project}
                projectMembers={projectMembers}
                organization={organization}
                similarProjects={similarProjects}
                isEditing={isEditing}
                onSaveChanges={handleSaveChanges}
              />
            </TabsContent>
            
            <TabsContent value="timeline" className="animate-in fade-in-50 slide-in-from-bottom-3">
              <ProjectTimeline 
                timeline={timeline}
                onAddEvent={addTimelineEvent}
                onCompleteEvent={completeTimelineEvent}
                isEditing={isEditing}
                projectStatus={projectStatus}
                onSubmitProject={submitProject}
                onApproveProject={approveProject}
                onRejectProject={rejectProject}
              />
            </TabsContent>
            
            <TabsContent value="tasks" className="animate-in fade-in-50 slide-in-from-bottom-3">
              <ProjectTasks
                tasks={tasks}
                onAddTask={addTask}
                onUpdateTaskStatus={updateTaskStatus}
                isEditing={isEditing}
              />
            </TabsContent>
            
            <TabsContent value="discussions" className="animate-in fade-in-50 slide-in-from-bottom-3">
              <ProjectDiscussions projectId={project.id} isEditing={isEditing} />
            </TabsContent>
            
            <TabsContent value="files" className="animate-in fade-in-50 slide-in-from-bottom-3">
              <ProjectFiles projectId={project.id} isEditing={isEditing} />
            </TabsContent>
            
            <TabsContent value="evaluation" className="animate-in fade-in-50 slide-in-from-bottom-3">
              <ProjectEvaluation projectId={project.id} isEditing={isEditing} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <FloatingActionButton />
      
      <Footer />
    </div>
  );
};

export default ProjectDetailsContent;
