
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';
import ProjectTimeline from './ProjectTimeline';
import ProjectTasks from './ProjectTasks';
import ProjectOverview from './ProjectOverview';
import ProjectParticipants from './ProjectParticipants';
import { TaskStatus } from '@/utils/taskUtils';

interface ProjectTasksProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  canEdit: boolean;
  project?: ProjectTheme;
}

interface ProjectTimelineProps {
  timeline: TimelineEvent[];
  completeTimelineEvent: (eventId: string) => void;
  canEdit: boolean;
}

interface ProjectTabsProps {
  project: ProjectTheme;
  timeline: TimelineEvent[];
  tasks: Task[];
  projectStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  isReserved: boolean;
  projectMembers: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    status?: 'active' | 'pending' | 'rejected';
  }[];
  organization: {
    id: string;
    name: string;
    website: string;
    logo: string;
  };
  similarProjects: ProjectTheme[];
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  completeTimelineEvent: (eventId: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  submitProject: (feedback: string) => void;
  approveProject: (feedback: string) => void;
  rejectProject: (feedback: string) => void;
  isEditing: boolean;
  onSaveChanges: (updates: Partial<ProjectTheme>) => Promise<void>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
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
  onSaveChanges,
  activeTab,
  setActiveTab
}) => {
  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:w-[600px] mb-8">
        <TabsTrigger value="overview">Նկարագիր</TabsTrigger>
        <TabsTrigger value="tasks">Առաջադրանքներ</TabsTrigger>
        <TabsTrigger value="timeline">Ժամանակացույց</TabsTrigger>
        <TabsTrigger value="participants">Մասնակիցներ</TabsTrigger>
        <TabsTrigger value="files" className="hidden md:flex">Ֆայլեր</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-500">
        <ProjectOverview 
          project={project}
          projectMembers={projectMembers}
          organization={organization}
          similarProjects={similarProjects}
          isEditing={isEditing}
          onSaveChanges={onSaveChanges}
        />
      </TabsContent>
      
      <TabsContent value="tasks" className="space-y-6 animate-in fade-in-50 duration-500">
        <ProjectTasks 
          tasks={tasks}
          onAddTask={addTask}
          updateTaskStatus={updateTaskStatus}
          canEdit={isEditing}
          project={project}
        />
      </TabsContent>
      
      <TabsContent value="timeline" className="space-y-6 animate-in fade-in-50 duration-500">
        <ProjectTimeline 
          timeline={timeline}
          completeTimelineEvent={completeTimelineEvent}
          canEdit={isEditing}
        />
      </TabsContent>
      
      <TabsContent value="participants" className="space-y-6 animate-in fade-in-50 duration-500">
        <ProjectParticipants />
      </TabsContent>
      
      <TabsContent value="files" className="space-y-6 animate-in fade-in-50 duration-500">
        <div className="text-center py-12 text-muted-foreground">
          Ֆայլերի բաժինը գտնվում է մշակման փուլում։
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProjectTabs;
