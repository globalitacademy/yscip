
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import ProjectDescription from './ProjectDescription';
import ProjectTimeline from './ProjectTimeline';
import ProjectTasks from './ProjectTasks';
import ProjectDiscussions from './ProjectDiscussions';
import ProjectFiles from './ProjectFiles';
import ProjectEvaluation from './ProjectEvaluation';
import ProjectHeaderBanner from './ProjectHeaderBanner';
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
  
  // Smooth scroll when tab changes
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        <ProjectHeaderBanner project={project} isEditing={isEditing} />
        
        <div className="container mx-auto px-4 py-8">
          <ProjectDescription 
            project={project}
            projectMembers={projectMembers}
            organization={organization}
            similarProjects={similarProjects}
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
