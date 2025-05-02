
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
import ProjectDiscussions from '@/components/project-details/ProjectDiscussions';
import ProjectFiles from '@/components/project-details/ProjectFiles';
import ProjectEvaluation from '@/components/project-details/ProjectEvaluation';
import ProjectOverview from './ProjectOverview';
import ProjectTimeline from './ProjectTimeline';
import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';
import { cn } from '@/lib/utils';
import { TaskStatus } from '@/utils/taskUtils';

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
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  submitProject: (feedback: string) => void;
  approveProject: (feedback: string) => void;
  rejectProject: (feedback: string) => void;
  isEditing?: boolean;
  onSaveChanges?: (updates: Partial<ProjectTheme>) => void;
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
  isEditing = false,
  onSaveChanges = () => {},
  activeTab,
  setActiveTab
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-16">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-7 h-auto rounded-xl bg-muted/50 p-1">
        {[
          { value: "overview", icon: <BookOpen size={16} />, label: "Նկարագիր" },
          { value: "timeline", icon: <CalendarRange size={16} />, label: "Ժամանակացույց" },
          { value: "tasks", icon: <ListChecks size={16} />, label: "Քայլեր" },
          { value: "discussions", icon: <MessageSquare size={16} />, label: "Քննարկումներ" },
          { value: "files", icon: <FileText size={16} />, label: "Ֆայլեր" },
          { value: "evaluation", icon: <Star size={16} />, label: "Գնահատական" },
          { value: "gantt", icon: <BarChart size={16} />, label: "Թայմլայն" }
        ].map(tab => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value} 
            className={cn("flex items-center gap-2 transition-all duration-200")}
          >
            {tab.icon} {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <div className="mt-8">
        <TabsContent value="overview" className="animate-fade-in">
          <ProjectOverview 
            project={project}
            projectMembers={projectMembers}
            organization={organization}
            similarProjects={similarProjects}
            isEditing={isEditing}
            onSaveChanges={onSaveChanges}
          />
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-6 space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <SlideUp>
                <div className="bg-card rounded-xl shadow-md p-6 border border-border/30">
                  <Timeline 
                    events={timeline}
                    onAddEvent={addTimelineEvent}
                    onCompleteEvent={completeTimelineEvent}
                    isEditing={isEditing}
                  />
                </div>
              </SlideUp>
            </div>
            
            <div>
              <SlideUp>
                <div className="bg-card rounded-xl shadow-md p-6 border border-border/30">
                  <ProjectApproval 
                    projectStatus={projectStatus}
                    onSubmit={submitProject}
                    onApprove={approveProject}
                    onReject={rejectProject}
                  />
                </div>
              </SlideUp>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-6 animate-fade-in">
          <SlideUp>
            <div className="bg-card rounded-xl shadow-md p-6 border border-border/30">
              <TaskManager 
                tasks={tasks}
                onAddTask={addTask}
                onUpdateTaskStatus={updateTaskStatus}
                isEditing={isEditing}
              />
            </div>
          </SlideUp>
        </TabsContent>
        
        <TabsContent value="discussions" className="mt-6 animate-fade-in">
          <SlideUp>
            <div className="bg-card rounded-xl shadow-md p-6 border border-border/30">
              <ProjectDiscussions projectId={project.id} isEditing={isEditing} />
            </div>
          </SlideUp>
        </TabsContent>
        
        <TabsContent value="files" className="mt-6 animate-fade-in">
          <SlideUp>
            <div className="bg-card rounded-xl shadow-md p-6 border border-border/30">
              <ProjectFiles projectId={project.id} isEditing={isEditing} />
            </div>
          </SlideUp>
        </TabsContent>
        
        <TabsContent value="evaluation" className="mt-6 animate-fade-in">
          <SlideUp>
            <div className="bg-card rounded-xl shadow-md p-6 border border-border/30">
              <ProjectEvaluation projectId={project.id} isEditing={isEditing} />
            </div>
          </SlideUp>
        </TabsContent>
        
        <TabsContent value="gantt" className="mt-6 animate-fade-in">
          <SlideUp>
            <div className="bg-card rounded-xl shadow-md p-6 border border-border/30">
              <ProjectTimeline 
                timeline={timeline}
                projectStatus={projectStatus}
                onSubmitProject={submitProject}
                onApproveProject={approveProject}
                onRejectProject={rejectProject}
                isEditing={isEditing}
              />
            </div>
          </SlideUp>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ProjectTabs;
