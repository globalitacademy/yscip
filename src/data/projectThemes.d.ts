
import { User } from "@/types/user";

export interface ProjectTheme {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  bannerImage?: string;
  complexity: string;
  technologies: string[];
  duration: string; // e.g. "2-3 weeks"
  createdBy?: string;
  organization?: string;
  organizationName?: string;
  institution?: string;
  isPublic?: boolean;
  similarProjects?: ProjectTheme[];
  goal?: string;
  resources?: { name: string; url: string }[];
  links?: { name: string; url: string }[];
  implementationSteps?: { step: string; description: string }[];
  requirements?: string[];
  difficulty?: string;
}

export type TimelineEvent = {
  id: string;
  title: string;
  date: string;
  description?: string;
  isCompleted?: boolean;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  status: 'todo' | 'inProgress' | 'in-progress' | 'review' | 'done' | 'completed' | 'open';
};
