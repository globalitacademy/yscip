
import { Task } from '@/types/database.types';

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
  detailedDescription?: string;
  complexity: 'Սկսնակ' | 'Միջին' | 'Առաջադեմ';
  techStack: string[];
  steps: string[];
  category: string;
  image?: string;
  duration?: string;
  prerequisites?: string[];
  learningOutcomes?: string[];
  timeline?: TimelineEvent[];
  tasks?: Task[];
  createdBy?: string;
  createdAt?: string;
  assignedInstructor?: string;
  assignedInstructorName?: string;
  assignedGroups?: string[];
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
