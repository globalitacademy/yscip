
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
