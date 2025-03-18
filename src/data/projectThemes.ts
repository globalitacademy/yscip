export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignedTo?: string;
  dueDate?: string;
  createdBy?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface ProjectTheme {
  id: number;
  title: string;
  description: string;
  image?: string;
  category: string;
  techStack?: string[];
  complexity?: string;
  duration?: string;
  createdBy?: string;
  createdAt?: string;
  tasks?: Task[];
  timeline?: TimelineEvent[];
  learningOutcomes?: string[];
  prerequisites?: string[];
  steps?: string[];
  detailedDescription?: string;
}

// Import all project categories
import { ecommerceProjects } from './categories/ecommerce';
import { healthcareProjects } from './categories/healthcare';
import { realEstateProjects } from './categories/realestate';
import { educationProjects } from './categories/education';
import { aiProjects } from './categories/artificialintelligence';
import { gameProjects } from './categories/games';
import { cybersecurityProjects } from './categories/cybersecurity';
import { fintechProjects } from './categories/fintech';

// Combine all project categories into one array
export const projectThemes: ProjectTheme[] = [
  ...ecommerceProjects,
  ...healthcareProjects,
  ...realEstateProjects,
  ...educationProjects,
  ...aiProjects,
  ...gameProjects,
  ...cybersecurityProjects,
  ...fintechProjects
];
