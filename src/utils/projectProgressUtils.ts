
import { Task, TimelineEvent } from '@/data/projectThemes';

/**
 * Calculate the overall progress percentage of a project
 * @param tasks The project's tasks
 * @param timeline The project's timeline events
 * @returns A number between 0 and 100 representing the progress percentage
 */
export const calculateProjectProgress = (tasks: Task[], timeline: TimelineEvent[]): number => {
  if (tasks.length === 0 && timeline.length === 0) {
    return 0;
  }
  
  // Calculate task progress
  const taskProgress = tasks.length > 0
    ? (tasks.filter(task => task.status === 'completed').length / tasks.length) * 100
    : 0;
    
  // Calculate timeline progress
  const timelineProgress = timeline.length > 0
    ? (timeline.filter(event => event.completed).length / timeline.length) * 100
    : 0;
  
  // Average the two progress metrics (weighted if needed)
  const weightTasks = tasks.length > 0 ? 0.6 : 0;
  const weightTimeline = timeline.length > 0 ? 0.4 : 0;
  
  if (weightTasks === 0 && weightTimeline === 0) {
    return 0;
  }
  
  const totalWeight = weightTasks + weightTimeline;
  const weightedProgress = (
    (taskProgress * weightTasks) + 
    (timelineProgress * weightTimeline)
  ) / totalWeight;
  
  return Math.round(weightedProgress);
};
