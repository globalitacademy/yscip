
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectContextType {
  project: ProjectTheme | null;
  timeline: TimelineEvent[];
  tasks: Task[];
  projectStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  completeTimelineEvent: (eventId: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  submitProject: (feedback: string) => void;
  approveProject: (feedback: string) => void;
  rejectProject: (feedback: string) => void;
  reserveProject: () => void;
  isReserved: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  projectId: number | null;
  initialProject: ProjectTheme | null;
  children: React.ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ 
  projectId, 
  initialProject,
  children 
}) => {
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectTheme | null>(initialProject);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectStatus, setProjectStatus] = useState<'not_submitted' | 'pending' | 'approved' | 'rejected'>('not_submitted');
  const [isReserved, setIsReserved] = useState(false);

  useEffect(() => {
    if (initialProject) {
      setProject(initialProject);
      setTimeline(initialProject.timeline || []);
      setTasks(initialProject.tasks || []);
    }
  }, [initialProject]);

  // Add sample timeline events for demo
  useEffect(() => {
    if (timeline.length === 0 && project) {
      const now = new Date();
      const startDate = new Date();
      startDate.setDate(now.getDate() - 5);
      
      const demoTimeline: TimelineEvent[] = [
        {
          id: uuidv4(),
          title: 'Պրոեկտի մեկնարկ',
          date: startDate.toISOString().split('T')[0],
          description: 'Նախագծի պահանջների հստակեցում և աշխատանքային պլանի կազմում',
          completed: true
        },
        {
          id: uuidv4(),
          title: 'Նախնական տարբերակի ներկայացում',
          date: now.toISOString().split('T')[0],
          description: 'Նախագծի նախնական տարբերակի ներկայացում և քննարկում',
          completed: false
        }
      ];
      
      setTimeline(demoTimeline);
    }
  }, [timeline.length, project]);

  // Add sample tasks for demo
  useEffect(() => {
    if (tasks.length === 0 && project && user) {
      const now = new Date();
      const dueDate = new Date();
      dueDate.setDate(now.getDate() + 7);
      
      const demoTasks: Task[] = [
        {
          id: uuidv4(),
          title: 'Պահանջների վերլուծություն',
          description: 'Հավաքել և վերլուծել նախագծի բոլոր պահանջները',
          status: 'done',
          assignedTo: user.id,
          dueDate: now.toISOString().split('T')[0],
          createdBy: 'instructor1'
        },
        {
          id: uuidv4(),
          title: 'Նախագծի կառուցվածքի մշակում',
          description: 'Ստեղծել նախագծի հիմնական կառուցվածքը և ճարտարապետությունը',
          status: 'in-progress',
          assignedTo: user.id,
          dueDate: dueDate.toISOString().split('T')[0],
          createdBy: 'instructor1'
        }
      ];
      
      setTasks(demoTasks);
    }
  }, [tasks.length, project, user]);

  const addTimelineEvent = (event: Omit<TimelineEvent, 'id'>) => {
    const newEvent = { ...event, id: uuidv4() };
    setTimeline(prev => [...prev, newEvent]);
  };

  const completeTimelineEvent = (eventId: string) => {
    setTimeline(prev => prev.map(event => 
      event.id === eventId ? { ...event, completed: true } : event
    ));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: uuidv4() };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const submitProject = (feedback: string) => {
    setProjectStatus('pending');
    console.log("Project submitted with feedback:", feedback);
  };

  const approveProject = (feedback: string) => {
    setProjectStatus('approved');
    console.log("Project approved with feedback:", feedback);
  };

  const rejectProject = (feedback: string) => {
    setProjectStatus('rejected');
    console.log("Project rejected with feedback:", feedback);
  };

  const reserveProject = () => {
    setIsReserved(true);
    console.log("Project reserved:", project?.title);
  };

  return (
    <ProjectContext.Provider
      value={{
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
        reserveProject,
        isReserved
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
