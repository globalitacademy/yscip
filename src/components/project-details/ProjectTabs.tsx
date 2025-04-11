import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/hooks/use-theme';
import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';

// Import tab content components
import ProjectOverviewTab from './tabs/ProjectOverviewTab';
import ProjectImplementationTab from './tabs/ProjectImplementationTab';
import ProjectResourcesTab from './tabs/ProjectResourcesTab';
import ProjectTeamTab from './tabs/ProjectTeamTab';
import ProjectSimilarTab from './tabs/ProjectSimilarTab';

interface ProjectTabsProps {
  project: ProjectTheme;
  timeline: TimelineEvent[];
  tasks: Task[];
  projectStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  isReserved: boolean;
  projectMembers: any[];
  organization: any;
  similarProjects: ProjectTheme[];
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  completeTimelineEvent: (eventId: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  submitProject: (feedback: string) => void;
  approveProject: (feedback: string) => void;
  rejectProject: (feedback: string) => void;
  isEditing: boolean;
  onSaveChanges: (updates: Partial<ProjectTheme>) => Promise<void>;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({
  project,
  timeline,
  tasks,
  projectStatus,
  isReserved,
  projectMembers,
  organization,
  similarProjects,
  addTimelineEvent,
  completeTimelineEvent,
  addTask,
  updateTaskStatus,
  submitProject,
  approveProject,
  rejectProject,
  isEditing,
  onSaveChanges
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <Tabs 
      defaultValue="overview" 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className={`grid grid-cols-5 mb-6 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <TabsTrigger value="overview">Նախագծի մասին</TabsTrigger>
        <TabsTrigger value="implementation">Իրականացում</TabsTrigger>
        <TabsTrigger value="resources">Ռեսուրսներ</TabsTrigger>
        <TabsTrigger value="team">Թիմ</TabsTrigger>
        <TabsTrigger value="similar">Նմանատիպ</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="focus-visible:outline-none">
        <ProjectOverviewTab />
      </TabsContent>
      
      <TabsContent value="implementation" className="focus-visible:outline-none">
        <ProjectImplementationTab 
          timeline={timeline}
          tasks={tasks}
          projectStatus={projectStatus}
          isEditing={isEditing}
          addTimelineEvent={addTimelineEvent}
          completeTimelineEvent={completeTimelineEvent}
          addTask={addTask}
          updateTaskStatus={updateTaskStatus}
          submitProject={submitProject}
          approveProject={approveProject}
          rejectProject={rejectProject}
          onSaveChanges={onSaveChanges}
        />
      </TabsContent>
      
      <TabsContent value="resources" className="focus-visible:outline-none">
        <ProjectResourcesTab 
          project={project}
          isEditing={isEditing} 
          onSaveChanges={onSaveChanges} 
        />
      </TabsContent>
      
      <TabsContent value="team" className="focus-visible:outline-none">
        <ProjectTeamTab 
          projectMembers={projectMembers} 
          organization={organization}
          isEditing={isEditing}
        />
      </TabsContent>
      
      <TabsContent value="similar" className="focus-visible:outline-none">
        <ProjectSimilarTab similarProjects={similarProjects} />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectTabs;
