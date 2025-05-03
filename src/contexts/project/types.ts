
import { Task, TimelineEvent, ProjectTheme } from '@/data/projectThemes';

export interface ProjectMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status?: 'active' | 'pending' | 'rejected';
}

export interface ProjectOrganization {
  id: string;
  name: string;
  website: string;
  logo: string;
}

export interface ProjectContextType {
  projectId: number;
  project: ProjectTheme | null;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  canEdit: boolean;
  timeline: TimelineEvent[];
  tasks: Task[];
  projectStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  completeTimelineEvent: (eventId: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: 'not_started' | 'in_progress' | 'completed' | 'blocked') => void;
  submitProject: (feedback: string) => void;
  approveProject: (feedback: string) => void;
  rejectProject: (feedback: string) => void;
  reserveProject: () => void;
  isReserved: boolean;
  projectReservations: any[];
  approveReservation: (reservationId: string) => void;
  rejectReservation: (reservationId: string, feedback: string) => void;
  projectProgress: number;
  openSupervisorDialog: () => void;
  closeSupervisorDialog: () => void;
  showSupervisorDialog: boolean;
  selectedSupervisor: string | null;
  selectSupervisor: (supervisorId: string) => void;
  getReservationStatus: () => 'pending' | 'approved' | 'rejected' | null;
  updateProject: (updates: Partial<ProjectTheme>) => Promise<boolean>;
  organization: ProjectOrganization | null;
  updateOrganization: (orgData: { name: string; website?: string; logo?: string; }) => Promise<boolean>;
  projectMembers: ProjectMember[];
  updateProjectMembers: (members: ProjectMember[]) => Promise<boolean>;
}

export interface ProjectProviderProps {
  children: React.ReactNode;
  projectId: number;
  initialProject: any;
  canEdit?: boolean;
}
