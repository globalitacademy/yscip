import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';
import { useAuth } from '@/contexts/AuthContext';
import { rolePermissions } from '@/data/userRoles';
import { toast } from '@/components/ui/use-toast';

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
  canStudentSubmit: boolean;
  canInstructorCreate: boolean;
  canInstructorAssign: boolean;
  canSupervisorApprove: boolean;
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

  // Get permissions based on user role
  const permissions = user ? rolePermissions[user.role] : rolePermissions.student;
  
  // Role-based permissions
  const canStudentSubmit = permissions.canSubmitProject && isReserved;
  const canInstructorCreate = permissions.canCreateProjects;
  const canInstructorAssign = permissions.canAssignProjects;
  const canSupervisorApprove = permissions.canApproveProject;

  // Check for existing reservations on mount
  useEffect(() => {
    if (projectId && user) {
      const reservedProjects = localStorage.getItem('reservedProjects');
      if (reservedProjects) {
        try {
          const reservations = JSON.parse(reservedProjects);
          const isAlreadyReserved = reservations.some((res: any) => 
            res.projectId === projectId && res.userId === user.id
          );
          setIsReserved(isAlreadyReserved);
        } catch (e) {
          console.error('Error parsing reserved projects:', e);
        }
      }
    }
  }, [projectId, user]);

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
    if (!permissions.canAddTimeline) return;
    
    const newEvent = { ...event, id: uuidv4() };
    setTimeline(prev => [...prev, newEvent]);
  };

  const completeTimelineEvent = (eventId: string) => {
    if (!permissions.canApproveTimelineEvents) return;
    
    setTimeline(prev => prev.map(event => 
      event.id === eventId ? { ...event, completed: true } : event
    ));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    if (!permissions.canAddTasks) return;
    
    const newTask = { ...task, id: uuidv4() };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    // Student can only update their assigned tasks
    if (user?.role === 'student') {
      const task = tasks.find(t => t.id === taskId);
      if (!task || task.assignedTo !== user.id) return;
    }
    
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const submitProject = (feedback: string) => {
    if (!permissions.canSubmitProject) return;
    
    setProjectStatus('pending');
    console.log("Project submitted with feedback:", feedback);
  };

  const approveProject = (feedback: string) => {
    if (!permissions.canApproveProject) return;
    
    setProjectStatus('approved');
    console.log("Project approved with feedback:", feedback);
  };

  const rejectProject = (feedback: string) => {
    if (!permissions.canApproveProject) return;
    
    setProjectStatus('rejected');
    console.log("Project rejected with feedback:", feedback);
  };

  const reserveProject = () => {
    // Only students can reserve projects
    if (!user || user.role !== 'student' || !project) return;
    
    // Save reservation in localStorage
    const reservedProjects = localStorage.getItem('reservedProjects');
    let reservations = [];
    
    if (reservedProjects) {
      try {
        reservations = JSON.parse(reservedProjects);
      } catch (e) {
        console.error('Error parsing reserved projects:', e);
      }
    }
    
    // Add new reservation
    const newReservation = {
      projectId: project.id,
      userId: user.id,
      projectTitle: project.title,
      timestamp: new Date().toISOString()
    };
    
    reservations.push(newReservation);
    localStorage.setItem('reservedProjects', JSON.stringify(reservations));
    
    setIsReserved(true);
    toast({
      title: "Պրոեկտն ամրագրված է",
      description: `Դուք հաջողությամբ ամրագրել եք "${project.title}" պրոեկտը։`,
    });
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
        isReserved,
        canStudentSubmit,
        canInstructorCreate,
        canInstructorAssign,
        canSupervisorApprove
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
