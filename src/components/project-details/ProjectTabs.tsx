
import React from 'react';
import { 
  BookOpen, 
  CalendarRange, 
  ListChecks, 
  MessageSquare, 
  FileText, 
  Star,
  Clock,
  BarChart
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SlideUp } from '@/components/LocalTransitions';
import Timeline from '@/components/Timeline';
import TaskManager from '@/components/tasks/TaskManager';
import ProjectApproval from '@/components/ProjectApproval';
import ProjectDiscussions from '@/components/projects/ProjectDiscussions';
import ProjectFiles from '@/components/projects/ProjectFiles';
import ProjectEvaluation from '@/components/projects/ProjectEvaluation';
import ProjectOverview from './ProjectOverview';
import ProjectTimeline from './ProjectTimeline';
import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';

interface ProjectTabsProps {
  project: ProjectTheme;
  timeline: TimelineEvent[];
  tasks: Task[];
  projectStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  isReserved: boolean;
  projectMembers: { id: string; name: string; role: string; avatar: string }[];
  organization: {
    id: string;
    name: string;
    website: string;
    logo: string;
  } | null;
  similarProjects: ProjectTheme[];
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  completeTimelineEvent: (eventId: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  submitProject: (feedback: string) => void;
  approveProject: (feedback: string) => void;
  rejectProject: (feedback: string) => void;
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
}) => {
  return (
    <Tabs defaultValue="overview" className="w-full mb-16">
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 h-auto">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <BookOpen size={16} /> Նկարագիր
        </TabsTrigger>
        <TabsTrigger value="timeline" className="flex items-center gap-2" disabled={!isReserved}>
          <CalendarRange size={16} /> Ժամանակացույց
        </TabsTrigger>
        <TabsTrigger value="tasks" className="flex items-center gap-2" disabled={!isReserved}>
          <ListChecks size={16} /> Քայլեր
        </TabsTrigger>
        <TabsTrigger value="discussions" className="flex items-center gap-2" disabled={!isReserved}>
          <MessageSquare size={16} /> Քննարկումներ
        </TabsTrigger>
        <TabsTrigger value="files" className="flex items-center gap-2" disabled={!isReserved}>
          <FileText size={16} /> Ֆայլեր
        </TabsTrigger>
        <TabsTrigger value="evaluation" className="flex items-center gap-2" disabled={!isReserved}>
          <Star size={16} /> Գնահատական
        </TabsTrigger>
        <TabsTrigger value="gantt" className="flex items-center gap-2" disabled={!isReserved}>
          <BarChart size={16} /> Թայմլայն
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-6">
        <ProjectOverview 
          project={project}
          projectMembers={projectMembers}
          organization={organization}
          similarProjects={similarProjects}
        />
      </TabsContent>
      
      <TabsContent value="timeline" className="mt-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <SlideUp>
              <Timeline 
                events={timeline}
                onAddEvent={addTimelineEvent}
                onCompleteEvent={completeTimelineEvent}
              />
            </SlideUp>
          </div>
          
          <div>
            <SlideUp>
              <ProjectApproval 
                projectStatus={projectStatus}
                onSubmit={submitProject}
                onApprove={approveProject}
                onReject={rejectProject}
              />
            </SlideUp>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="tasks" className="mt-6">
        <SlideUp>
          <TaskManager 
            tasks={tasks}
            onAddTask={addTask}
            onUpdateTaskStatus={updateTaskStatus}
          />
        </SlideUp>
      </TabsContent>
      
      <TabsContent value="discussions" className="mt-6">
        <SlideUp>
          <ProjectDiscussions projectId={project.id} />
        </SlideUp>
      </TabsContent>
      
      <TabsContent value="files" className="mt-6">
        <SlideUp>
          <ProjectFiles projectId={project.id} />
        </SlideUp>
      </TabsContent>
      
      <TabsContent value="evaluation" className="mt-6">
        <SlideUp>
          <ProjectEvaluation projectId={project.id} />
        </SlideUp>
      </TabsContent>
      
      <TabsContent value="gantt" className="mt-6">
        <SlideUp>
          <ProjectTimeline 
            timeline={timeline} 
            tasks={tasks}
          />
        </SlideUp>
      </TabsContent>
    </Tabs>
  );
};

export default ProjectTabs;
