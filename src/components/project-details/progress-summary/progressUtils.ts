
import { Task, TimelineEvent, ProjectTheme } from '@/data/projectThemes';

export const getProgressColor = (projectProgress: number): string => {
  if (projectProgress >= 75) return 'bg-green-500';
  if (projectProgress >= 50) return 'bg-blue-500';
  if (projectProgress >= 25) return 'bg-amber-500';
  return 'bg-gray-500';
};

export const calculateDaysRemaining = (project: ProjectTheme | null, projectProgress: number): number | null => {
  if (!project?.duration) return null;
  
  // Պարզ հաշվարկ՝ ելնելով տևողությունից և առաջընթացից
  const durationMatch = project.duration.match(/(\d+)/);
  if (!durationMatch) return null;
  
  const totalDays = parseInt(durationMatch[1]) * 30; // Ամիսները օրերի փոխարկում
  const remainingDays = Math.round(totalDays * (1 - projectProgress / 100));
  
  return remainingDays;
};

// Հաշվարկվում է թե ինչպիսի կատեգորիաներում են բաշխված խնդիրները (todo, in progress, done)
export const calculateTaskDistribution = (tasks: Task[]): { todo: number, inProgress: number, completed: number } => {
  if (tasks.length === 0) {
    return { todo: 0, inProgress: 0, completed: 0 };
  }
  
  // Update the comparison to include 'backlog' in the todo tasks count
  const todoCount = tasks.filter(task => task.status === 'todo' || task.status === 'open' || task.status === 'pending' || task.status === 'backlog').length;
  const inProgressCount = tasks.filter(task => task.status === 'inProgress' || task.status === 'in-progress' || task.status === 'review').length;
  const completedCount = tasks.filter(task => task.status === 'done' || task.status === 'completed').length;
  
  return {
    todo: Math.round((todoCount / tasks.length) * 100),
    inProgress: Math.round((inProgressCount / tasks.length) * 100),
    completed: Math.round((completedCount / tasks.length) * 100)
  };
};
