
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';
import { useAuth } from '@/contexts/AuthContext';
import { rolePermissions } from '@/data/userRoles';
import { toast } from '@/components/ui/use-toast';

interface ProjectReservation {
  projectId: number;
  userId: string;
  projectTitle: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  supervisorId?: string;
  instructorId?: string;
  feedback?: string;
}

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
  reserveProject: (supervisorId?: string, instructorId?: string) => void;
  isReserved: boolean;
  canStudentSubmit: boolean;
  canInstructorCreate: boolean;
  canInstructorAssign: boolean;
  canSupervisorApprove: boolean;
  projectReservations: ProjectReservation[];
  approveReservation: (reservationId: number) => void;
  rejectReservation: (reservationId: number, feedback: string) => void;
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
  const [projectReservations, setProjectReservations] = useState<ProjectReservation[]>([]);

  // Get permissions based on user role
  const permissions = user ? rolePermissions[user.role] : rolePermissions.student;
  
  // Role-based permissions
  const canStudentSubmit = permissions.canSubmitProject && isReserved;
  const canInstructorCreate = permissions.canCreateProjects;
  // Fix the canInstructorAssign property by providing a fallback
  const canInstructorAssign = 'canAssignProjects' in permissions ? permissions.canAssignProjects : false;
  const canSupervisorApprove = permissions.canApproveProject;

  // Load project reservations from localStorage
  useEffect(() => {
    const reservedProjects = localStorage.getItem('reservedProjects');
    if (reservedProjects) {
      try {
        const reservations = JSON.parse(reservedProjects);
        setProjectReservations(reservations);
        
        // Check if current project is reserved by current user
        if (projectId && user) {
          const isAlreadyReserved = reservations.some((res: ProjectReservation) => 
            res.projectId === projectId && res.userId === user.id
          );
          setIsReserved(isAlreadyReserved);
        }
      } catch (e) {
        console.error('Error parsing reserved projects:', e);
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

  const reserveProject = (supervisorId?: string, instructorId?: string) => {
    // Only students can reserve projects
    if (!user || user.role !== 'student' || !project) return;
    
    // Save reservation in localStorage
    const reservedProjects = localStorage.getItem('reservedProjects');
    let reservations: ProjectReservation[] = [];
    
    if (reservedProjects) {
      try {
        reservations = JSON.parse(reservedProjects);
      } catch (e) {
        console.error('Error parsing reserved projects:', e);
      }
    }
    
    // Add new reservation
    const newReservation: ProjectReservation = {
      projectId: project.id,
      userId: user.id,
      projectTitle: project.title,
      timestamp: new Date().toISOString(),
      status: 'pending',
      supervisorId,
      instructorId
    };
    
    reservations.push(newReservation);
    localStorage.setItem('reservedProjects', JSON.stringify(reservations));
    setProjectReservations(reservations);
    
    setIsReserved(true);
    toast({
      title: "Պրոեկտը ամրագրված է",
      description: `Դուք հաջողությամբ ամրագրել եք "${project.title}" պրոեկտը։ Խնդրում ենք սպասել հաստատման։`,
    });
  };

  const approveReservation = (projectId: number) => {
    if (!user || (user.role !== 'supervisor' && user.role !== 'instructor' && user.role !== 'project_manager')) return;
    
    const reservedProjects = localStorage.getItem('reservedProjects');
    if (!reservedProjects) return;
    
    try {
      let reservations: ProjectReservation[] = JSON.parse(reservedProjects);
      
      reservations = reservations.map(res => {
        if (res.projectId === projectId) {
          if ((user.role === 'supervisor' || user.role === 'project_manager') && res.supervisorId === user.id) {
            return { ...res, status: 'approved' };
          } else if (user.role === 'instructor' && res.instructorId === user.id) {
            return { ...res, status: 'approved' };
          }
        }
        return res;
      });
      
      localStorage.setItem('reservedProjects', JSON.stringify(reservations));
      setProjectReservations(reservations);
      
      toast({
        title: "Հաստատված",
        description: "Պրոեկտի ամրագրումը հաստատվել է։",
      });
    } catch (e) {
      console.error('Error updating reservation:', e);
    }
  };

  const rejectReservation = (projectId: number, feedback: string) => {
    if (!user || (user.role !== 'supervisor' && user.role !== 'instructor' && user.role !== 'project_manager')) return;
    
    const reservedProjects = localStorage.getItem('reservedProjects');
    if (!reservedProjects) return;
    
    try {
      let reservations: ProjectReservation[] = JSON.parse(reservedProjects);
      
      reservations = reservations.map(res => {
        if (res.projectId === projectId) {
          if ((user.role === 'supervisor' || user.role === 'project_manager') && res.supervisorId === user.id) {
            return { ...res, status: 'rejected', feedback };
          } else if (user.role === 'instructor' && res.instructorId === user.id) {
            return { ...res, status: 'rejected', feedback };
          }
        }
        return res;
      });
      
      localStorage.setItem('reservedProjects', JSON.stringify(reservations));
      setProjectReservations(reservations);
      
      toast({
        title: "Մերժված",
        description: "Պրոեկտի ամրագրումը մերժվել է։",
      });
    } catch (e) {
      console.error('Error updating reservation:', e);
    }
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
        canSupervisorApprove,
        projectReservations,
        approveReservation,
        rejectReservation
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
