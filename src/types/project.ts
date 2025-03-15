
import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';

export interface ProjectReservation {
  id: string;
  projectId: number;
  userId: string;
  projectTitle: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  supervisorId?: string;
  instructorId?: string;
  feedback?: string;
  studentId?: string;
  studentName?: string;
  requestDate?: string;
  responseDate?: string;
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
  reserveProject: () => void;
  isReserved: boolean;
  canStudentSubmit: boolean;
  canInstructorCreate: boolean;
  canInstructorAssign: boolean;
  canSupervisorApprove: boolean;
  projectReservations: ProjectReservation[];
  approveReservation: (reservationId: string) => void;
  rejectReservation: (reservationId: string, feedback: string) => void;
  projectProgress: number;
  openSupervisorDialog: () => void;
  closeSupervisorDialog: () => void;
  showSupervisorDialog: boolean;
  selectedSupervisor: string | null;
  selectSupervisor: (supervisorId: string) => void;
  getReservationStatus: () => 'pending' | 'approved' | 'rejected' | null;
}

export interface ProjectProviderProps {
  projectId: number | null;
  initialProject: ProjectTheme | null;
  children: React.ReactNode;
}
