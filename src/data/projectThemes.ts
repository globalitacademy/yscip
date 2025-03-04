
export interface ProjectTheme {
  id: number;
  title: string;
  description: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  techStack: string[];
  steps: string[];
  category: string;
}

export const projectThemes: ProjectTheme[] = [
  {
    id: 1,
    title: "Minimalist Personal Portfolio",
    description: "A clean, modern portfolio site showcasing your work and skills with subtle animations and responsive design.",
    complexity: "Beginner",
    techStack: ["React", "Tailwind CSS", "Framer Motion"],
    steps: [
      "Set up React project with Vite",
      "Implement responsive layout with Tailwind",
      "Create portfolio section with filterable gallery",
      "Add subtle animations with Framer Motion",
      "Optimize for performance and accessibility"
    ],
    category: "Portfolio"
  },
  {
    id: 2,
    title: "E-commerce Dashboard",
    description: "An administrative dashboard for managing products, orders, customers, and analytics for an online store.",
    complexity: "Intermediate",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Chart.js"],
    steps: [
      "Create Next.js app with TypeScript",
      "Design dashboard layout with sidebar navigation",
      "Implement product management CRUD operations",
      "Add order processing workflow",
      "Create analytics dashboard with Chart.js",
      "Implement user authentication and role-based access"
    ],
    category: "Dashboard"
  },
  {
    id: 3,
    title: "AI-Powered Content Generator",
    description: "A web application that uses AI to generate blog posts, social media content, and marketing copy based on user prompts.",
    complexity: "Advanced",
    techStack: ["React", "Node.js", "OpenAI API", "MongoDB"],
    steps: [
      "Set up React frontend with form inputs for content parameters",
      "Create Node.js backend with OpenAI API integration",
      "Implement user authentication and content saving",
      "Add content editing and history features",
      "Implement content quality analysis tools",
      "Add export options for different platforms"
    ],
    category: "AI Applications"
  },
  {
    id: 4,
    title: "Task Management Application",
    description: "A Kanban-style task manager with drag-and-drop functionality, labels, due dates, and team collaboration features.",
    complexity: "Intermediate",
    techStack: ["React", "TypeScript", "Redux", "Firebase"],
    steps: [
      "Set up React project with TypeScript",
      "Implement Redux for state management",
      "Create Kanban board with react-beautiful-dnd",
      "Add task creation, editing, and filtering",
      "Implement Firebase for real-time updates",
      "Add user authentication and team features"
    ],
    category: "Productivity"
  },
  {
    id: 5,
    title: "Real Estate Listing Platform",
    description: "A property listing website with search filters, interactive maps, and virtual tour capabilities.",
    complexity: "Advanced",
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Google Maps API"],
    steps: [
      "Create Next.js application with TypeScript",
      "Set up database schema with Prisma",
      "Implement property listing and detail pages",
      "Add search functionality with filters",
      "Integrate Google Maps for property locations",
      "Add user accounts and saved properties",
      "Implement virtual tour feature with 360° images"
    ],
    category: "Real Estate"
  },
  {
    id: 6,
    title: "Budget Tracker",
    description: "A personal finance application for tracking income, expenses, and savings goals with insightful visualizations.",
    complexity: "Intermediate",
    techStack: ["React", "D3.js", "Firebase", "Tailwind CSS"],
    steps: [
      "Create React application with Tailwind styling",
      "Implement expense and income tracking forms",
      "Add categorization and tagging system",
      "Create data visualizations with D3.js",
      "Implement budget setting and goal tracking",
      "Add recurring transaction functionality",
      "Integrate with Firebase for data storage"
    ],
    category: "Finance"
  },
  {
    id: 7,
    title: "Recipe Sharing Community",
    description: "A platform for food enthusiasts to share, discover, and save recipes with social features like comments and ratings.",
    complexity: "Intermediate",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Cloudinary"],
    steps: [
      "Create React frontend with recipe browsing and filtering",
      "Implement user authentication and profiles",
      "Build recipe creation form with image uploads",
      "Add commenting and rating system",
      "Implement recipe collections and favorites",
      "Create recommendation engine based on user preferences",
      "Add social sharing capabilities"
    ],
    category: "Food & Cooking"
  },
  {
    id: 8,
    title: "Learning Management System",
    description: "An educational platform for creating and taking courses with features like quizzes, progress tracking, and certificates.",
    complexity: "Advanced",
    techStack: ["Next.js", "TypeScript", "Nest.js", "PostgreSQL", "Redis"],
    steps: [
      "Set up Next.js frontend with course browsing",
      "Create Nest.js backend with PostgreSQL",
      "Implement user roles (student, instructor, admin)",
      "Add course creation and management tools",
      "Create interactive lesson content with rich media",
      "Implement quiz and assessment system",
      "Add progress tracking and certificates",
      "Implement payment processing for course purchases"
    ],
    category: "Education"
  },
  {
    id: 9,
    title: "Health & Fitness Tracker",
    description: "A wellness application for tracking workouts, nutrition, sleep, and health metrics with customizable goals.",
    complexity: "Intermediate",
    techStack: ["React Native", "TypeScript", "Firebase", "HealthKit/Google Fit API"],
    steps: [
      "Set up React Native project with TypeScript",
      "Create workout logging functionality",
      "Implement nutrition tracking and meal planning",
      "Add sleep tracking and analysis",
      "Integrate with health device APIs",
      "Implement goal setting and progress visualization",
      "Add social features and challenges"
    ],
    category: "Health & Fitness"
  },
  {
    id: 10,
    title: "Collaborative Document Editor",
    description: "A real-time document editor allowing multiple users to edit text, spreadsheets, and presentations simultaneously.",
    complexity: "Advanced",
    techStack: ["React", "TypeScript", "WebSockets", "MongoDB", "Redis"],
    steps: [
      "Create React frontend with editor interface",
      "Implement text editing with Draft.js or Slate",
      "Set up WebSocket server for real-time collaboration",
      "Add version history and change tracking",
      "Implement document organization and sharing",
      "Add commenting and suggestion features",
      "Create export options for different formats"
    ],
    category: "Productivity"
  },
  {
    id: 11,
    title: "Social Media Dashboard",
    description: "A unified dashboard for managing multiple social media accounts, scheduling posts, and analyzing engagement metrics.",
    complexity: "Intermediate",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Social Media APIs"],
    steps: [
      "Create React dashboard with account overview",
      "Implement social media API integrations",
      "Add post creation and scheduling",
      "Create analytics and reporting features",
      "Implement audience insights and engagement tracking",
      "Add content calendar and team collaboration"
    ],
    category: "Social Media"
  },
  {
    id: 12,
    title: "Weather Application",
    description: "A weather forecast app with location-based predictions, radar maps, and severe weather alerts.",
    complexity: "Beginner",
    techStack: ["React", "OpenWeatherMap API", "Leaflet.js", "Tailwind CSS"],
    steps: [
      "Set up React project with Tailwind",
      "Implement location search and geolocation",
      "Integrate weather API for forecast data",
      "Create interactive weather map with Leaflet.js",
      "Add weather alerts and notifications",
      "Implement daily and hourly forecasts",
      "Add weather history and comparison"
    ],
    category: "Weather"
  }
];

// Function to get more projects up to 100
export const getMoreProjects = (): ProjectTheme[] => {
  // In a real implementation, this would return the full list of 100 projects
  // For now, we'll just repeat the existing ones with modified IDs
  const extraProjects: ProjectTheme[] = [];
  
  for (let i = 13; i <= 100; i++) {
    const baseProject = projectThemes[i % projectThemes.length];
    extraProjects.push({
      ...baseProject,
      id: i,
      title: `${baseProject.title} ${Math.floor(i / 12) + 1}`,
    });
  }
  
  return [...projectThemes, ...extraProjects];
};
