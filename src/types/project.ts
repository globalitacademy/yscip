
import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';

export interface ProjectReservation {
  projectId: number;
  userId: string;
  projectTitle: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  supervisorId?: string;
  instructorId?: string;
  feedback?: string;
}

export interface ProjectContextType {
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
  projectProgress: number;
}

export interface ProjectProviderProps {
  projectId: number | null;
  initialProject: ProjectTheme | null;
  children: React.ReactNode;
}
