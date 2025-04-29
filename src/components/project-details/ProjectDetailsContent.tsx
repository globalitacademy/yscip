
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';
import { AlertCircle, Tag, Clock, CalendarRange, Users, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
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
import ProjectHeaderBanner from './ProjectHeaderBanner';
import ProjectRoleBasedActions from './ProjectRoleBasedActions';
import ProjectParticipants from './ProjectParticipants';
import ProjectProgressSummary from './ProjectProgressSummary';
import { motion } from 'framer-motion';

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
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add a smooth scroll effect when tab changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [activeTab]);
  
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-background to-background/80">
        <ProjectHeaderBanner project={project} isEditing={isEditing} />
        
        <motion.div 
          className="container mx-auto px-4 py-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projectStatus === 'rejected' && (
            <motion.div variants={itemVariants}>
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Նախագիծը մերժված է</AlertTitle>
                <AlertDescription>
                  Ձեր նախագիծը մերժվել է ղեկավարի կողմից։ Խնդրում ենք վերանայել մերժման պատճառները և կապ հաստատել ղեկավարի հետ։
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          {isEditing && (
            <motion.div variants={itemVariants}>
              <Alert className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700/30 dark:text-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                <AlertTitle>Խմբագրման ռեժիմ</AlertTitle>
                <AlertDescription className="dark:text-amber-300/80">
                  Դուք կարող եք խմբագրել նախագծի տեքստերն ու նկարները: Պարզապես սեղմեք համապատասխան դաշտերի վրա և կատարեք փոփոխությունները: 
                  Ավարտելուց հետո անպայման սեղմեք պահպանել կոճակը:
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          {/* Երկու սյունակներ՝ գործողություններ և առաջընթաց */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
            variants={itemVariants}
          >
            <motion.div 
              className="md:col-span-2"
              variants={itemVariants}
            >
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 shadow-sm">
                      <Tag className="h-3.5 w-3.5" /> 
                      {project.category}
                    </Badge>
                    {project.duration && (
                      <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 shadow-sm">
                        <Clock className="h-3.5 w-3.5" /> 
                        {project.duration}
                      </Badge>
                    )}
                    {projectStatus && (
                      <Badge 
                        className={cn(
                          "px-3 py-1.5 shadow-sm",
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
                      <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 shadow-sm">
                        <Users className="h-3.5 w-3.5" /> 
                        Ամրագրված
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <ProjectRoleBasedActions />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ProjectProgressSummary />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mb-6"
            variants={itemVariants}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                className="pl-10 bg-white dark:bg-zinc-800 border-muted/30 rounded-full shadow-sm" 
                placeholder="Փնտրեք նախագծում..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto rounded-xl bg-white dark:bg-zinc-800/70 p-1 mb-8 shadow-sm">
                <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Նկարագիր</TabsTrigger>
                <TabsTrigger value="timeline" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Ժամանակացույց</TabsTrigger>
                <TabsTrigger value="tasks" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Քայլեր</TabsTrigger>
                <TabsTrigger value="participants" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Մասնակիցներ</TabsTrigger>
                <TabsTrigger value="discussions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Քննարկումներ</TabsTrigger>
                <TabsTrigger value="files" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Ֆայլեր</TabsTrigger>
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
              
              <TabsContent value="participants" className="animate-in fade-in-50 slide-in-from-bottom-3">
                <ProjectParticipants />
              </TabsContent>
              
              <TabsContent value="discussions" className="animate-in fade-in-50 slide-in-from-bottom-3">
                <ProjectDiscussions projectId={project.id} isEditing={isEditing} />
              </TabsContent>
              
              <TabsContent value="files" className="animate-in fade-in-50 slide-in-from-bottom-3">
                <ProjectFiles projectId={project.id} isEditing={isEditing} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
      
      <FloatingActionButton />
      
      <Footer />
    </div>
  );
};

export default ProjectDetailsContent;
