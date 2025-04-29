
import { LucideIcon } from 'lucide-react';
import { BrainCircuit, Code, LayoutDashboard, Rocket, Sparkles, Terminal, Wrench } from 'lucide-react';
import { TaskStatus } from '@/utils/taskUtils';

export interface ProjectTheme {
  id: number;
  title: string;
  description: string;
  image?: string;
  bannerImage?: string;
  category: string;
  techStack?: string[];
  technologies?: string[];
  complexity?: string;
  difficulty?: string;
  duration?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  is_public?: boolean;
  steps?: string[];
  prerequisites?: string[];
  learningOutcomes?: string[];
  organizationName?: string;
  detailedDescription?: string;
  status?: string;
  timeline?: TimelineEvent[];
  tasks?: Task[];
  goal?: string;
  resources?: string[];
  links?: { title: string; url: string }[];
  requirements?: string[];
  implementationSteps?: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee?: string;
  assignedTo?: string;
  dueDate?: string;
  createdBy?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  isCompleted: boolean;
  description?: string;
}

export interface Category {
  name: string;
  icon: LucideIcon;
}

export const categories: Category[] = [
  {
    name: 'Web Development',
    icon: Code,
  },
  {
    name: 'Mobile App Development',
    icon: BrainCircuit,
  },
  {
    name: 'AI & Machine Learning',
    icon: BrainCircuit,
  },
  {
    name: 'Data Science',
    icon: BrainCircuit,
  },
  {
    name: 'Cybersecurity',
    icon: BrainCircuit,
  },
  {
    name: 'Cloud Computing',
    icon: BrainCircuit,
  },
  {
    name: 'DevOps',
    icon: BrainCircuit,
  },
  {
    name: 'Game Development',
    icon: BrainCircuit,
  },
  {
    name: 'UI/UX Design',
    icon: BrainCircuit,
  },
  {
    name: 'Project Management',
    icon: BrainCircuit,
  },
];

export const projectThemes: ProjectTheme[] = [
  {
    id: 1,
    title: 'React E-Commerce App',
    description: 'A fully functional e-commerce application built with React.',
    image: 'https://source.unsplash.com/random/800x600/?ecommerce',
    category: 'Web Development',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
    complexity: 'Միջին',
    duration: '3 ամիս',
    createdBy: 'admin',
    createdAt: '2023-01-01',
    updatedAt: '2023-04-01',
    is_public: true,
    steps: ['Set up project', 'Develop components', 'Implement backend', 'Deploy'],
    prerequisites: ['JavaScript', 'React', 'Node.js'],
    learningOutcomes: ['Full-stack development', 'E-commerce concepts'],
    organizationName: 'ՀՊՏՀ'
  },
  {
    id: 2,
    title: 'Mobile Task Manager',
    description: 'A mobile application to manage tasks on the go.',
    image: 'https://source.unsplash.com/random/800x600/?mobileapp',
    category: 'Mobile App Development',
    techStack: ['React Native', 'Firebase'],
    complexity: 'Միջին',
    duration: '2 ամիս',
    createdBy: 'admin',
    createdAt: '2023-02-15',
    updatedAt: '2023-05-15',
    is_public: true,
    steps: ['Design UI', 'Implement features', 'Test on devices', 'Publish'],
    prerequisites: ['JavaScript', 'React Native'],
    learningOutcomes: ['Mobile development', 'Firebase integration'],
    organizationName: 'ՀՊՏՀ'
  },
  {
    id: 3,
    title: 'AI Chatbot',
    description: 'An AI-powered chatbot for customer support.',
    image: 'https://source.unsplash.com/random/800x600/?ai',
    category: 'AI & Machine Learning',
    techStack: ['Python', 'TensorFlow', 'Flask'],
    complexity: 'Բարձր',
    duration: '4 ամիս',
    createdBy: 'admin',
    createdAt: '2023-03-01',
    updatedAt: '2023-06-01',
    is_public: true,
    steps: ['Collect data', 'Train model', 'Deploy API', 'Integrate'],
    prerequisites: ['Python', 'Machine Learning'],
    learningOutcomes: ['AI development', 'API deployment'],
    organizationName: 'ՀՊՏՀ'
  },
  {
    id: 4,
    title: 'Data Analysis Dashboard',
    description: 'A dashboard to visualize and analyze data.',
    image: 'https://source.unsplash.com/random/800x600/?dashboard',
    category: 'Data Science',
    techStack: ['Python', 'Pandas', 'Tableau'],
    complexity: 'Միջին',
    duration: '3 ամիս',
    createdBy: 'admin',
    createdAt: '2023-04-01',
    updatedAt: '2023-07-01',
    is_public: true,
    steps: ['Gather data', 'Clean data', 'Create charts', 'Deploy'],
    prerequisites: ['Python', 'Data Analysis'],
    learningOutcomes: ['Data visualization', 'Dashboard creation'],
    organizationName: 'ՀՊՏՀ'
  },
  {
    id: 5,
    title: 'Cybersecurity Audit Tool',
    description: 'A tool to audit and improve cybersecurity.',
    image: 'https://source.unsplash.com/random/800x600/?cybersecurity',
    category: 'Cybersecurity',
    techStack: ['Python', 'Nmap', 'Wireshark'],
    complexity: 'Բարձր',
    duration: '4 ամիս',
    createdBy: 'admin',
    createdAt: '2023-05-01',
    updatedAt: '2023-08-01',
    is_public: true,
    steps: ['Scan network', 'Analyze results', 'Generate report', 'Implement fixes'],
    prerequisites: ['Networking', 'Security'],
    learningOutcomes: ['Security auditing', 'Network analysis'],
    organizationName: 'ՀՊՏՀ'
  },
  {
    id: 6,
    title: 'Cloud Management Platform',
    description: 'A platform to manage cloud resources.',
    image: 'https://source.unsplash.com/random/800x600/?cloudcomputing',
    category: 'Cloud Computing',
    techStack: ['AWS', 'Azure', 'GCP'],
    complexity: 'Բարձր',
    duration: '4 ամիս',
    createdBy: 'admin',
    createdAt: '2023-06-01',
    updatedAt: '2023-09-01',
    is_public: true,
    steps: ['Set up accounts', 'Configure resources', 'Monitor usage', 'Optimize'],
    prerequisites: ['Cloud Computing', 'Networking'],
    learningOutcomes: ['Cloud management', 'Resource optimization'],
    organizationName: 'ՀՊՏՀ'
  },
  {
    id: 7,
    title: 'DevOps Automation Tool',
    description: 'A tool to automate DevOps processes.',
    image: 'https://source.unsplash.com/random/800x600/?devops',
    category: 'DevOps',
    techStack: ['Jenkins', 'Docker', 'Kubernetes'],
    complexity: 'Բարձր',
    duration: '4 ամիս',
    createdBy: 'admin',
    createdAt: '2023-07-01',
    updatedAt: '2023-10-01',
    is_public: true,
    steps: ['Set up CI/CD', 'Containerize app', 'Orchestrate deployment', 'Monitor'],
    prerequisites: ['DevOps', 'Containerization'],
    learningOutcomes: ['CI/CD', 'Container orchestration'],
    organizationName: 'ՀՊՏՀ'
  },
  {
    id: 8,
    title: '3D Game Engine',
    description: 'A 3D game engine built from scratch.',
    image: 'https://source.unsplash.com/random/800x600/?gamedev',
    category: 'Game Development',
    techStack: ['C++', 'OpenGL', 'DirectX'],
    complexity: 'Բարձր',
    duration: '6 ամիս',
    createdBy: 'admin',
    createdAt: '2023-08-01',
    updatedAt: '2024-02-01',
    is_public: true,
    steps: ['Set up graphics', 'Implement physics', 'Create AI', 'Test'],
    prerequisites: ['C++', 'Graphics'],
    learningOutcomes: ['Game engine architecture', '3D graphics'],
    organizationName: 'ՀՊՏՀ'
  },
  {
    id: 9,
    title: 'UI/UX Design System',
    description: 'A design system for UI/UX consistency.',
    image: 'https://source.unsplash.com/random/800x600/?uiux',
    category: 'UI/UX Design',
    techStack: ['Figma', 'Sketch', 'Adobe XD'],
    complexity: 'Միջին',
    duration: '3 ամիս',
    createdBy: 'admin',
    createdAt: '2023-09-01',
    updatedAt: '2023-12-01',
    is_public: true,
    steps: ['Research trends', 'Create components', 'Document system', 'Implement'],
    prerequisites: ['UI/UX', 'Design'],
    learningOutcomes: ['Design systems', 'UI/UX principles'],
    organizationName: 'ՀՊՏՀ'
  },
  {
    id: 10,
    title: 'Agile Project Management Tool',
    description: 'A tool to manage projects using Agile methodologies.',
    image: 'https://source.unsplash.com/random/800x600/?projectmanagement',
    category: 'Project Management',
    techStack: ['Jira', 'Confluence', 'Trello'],
    complexity: 'Միջին',
    duration: '3 ամիս',
    createdBy: 'admin',
    createdAt: '2023-10-01',
    updatedAt: '2024-01-01',
    is_public: true,
    steps: ['Set up boards', 'Define sprints', 'Track progress', 'Retrospect'],
    prerequisites: ['Project Management', 'Agile'],
    learningOutcomes: ['Agile methodologies', 'Project tracking'],
    organizationName: 'ՀՊՏՀ'
  },
];

// Mock function to simulate fetching projects
export const fetchProjects = (): Promise<ProjectTheme[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(projectThemes);
    }, 500);
  });
};

// Mock function to simulate creating a project
export const createProject = (project: ProjectTheme): Promise<ProjectTheme> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProject = { ...project, id: projectThemes.length + 1 };
      projectThemes.push(newProject);
      resolve(newProject);
    }, 500);
  });
};

// Mock function to simulate updating a project
export const updateProject = (id: number, updates: Partial<ProjectTheme>): Promise<ProjectTheme> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const projectIndex = projectThemes.findIndex((project) => project.id === id);
      if (projectIndex === -1) {
        reject(new Error('Project not found'));
        return;
      }

      projectThemes[projectIndex] = { ...projectThemes[projectIndex], ...updates };
      resolve(projectThemes[projectIndex]);
    }, 500);
  });
};

// Mock function to simulate deleting a project
export const deleteProject = (id: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const projectIndex = projectThemes.findIndex((project) => project.id === id);
      if (projectIndex === -1) {
        reject(new Error('Project not found'));
        return;
      }

      projectThemes.splice(projectIndex, 1);
      resolve(true);
    }, 500);
  });
};
