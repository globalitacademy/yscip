
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
    ? (tasks.filter(task => task.status === 'completed' || task.status === 'done').length / tasks.length) * 100
    : 0;
    
  // Calculate timeline progress
  const timelineProgress = timeline.length > 0
    ? (timeline.filter(event => event.isCompleted).length / timeline.length) * 100
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

/**
 * Generate sample timeline events for demonstration
 */
export const generateSampleTimeline = (): TimelineEvent[] => {
  return [
    {
      id: '1',
      title: 'Նախագիծը սկսված է',
      date: '2023-09-01',
      isCompleted: true
    },
    {
      id: '2',
      title: 'Պահանջների հավաքագրում',
      date: '2023-09-15',
      isCompleted: true
    },
    {
      id: '3',
      title: 'Նախագծի նախատիպ',
      date: '2023-10-01',
      isCompleted: false
    },
    {
      id: '4',
      title: 'Նախագծի ավարտ',
      date: '2023-11-15',
      isCompleted: false
    }
  ];
};

/**
 * Generate sample tasks for demonstration
 */
export const generateSampleTasks = (userId: string): Task[] => {
  return [
    {
      id: '1',
      title: 'Պահանջների փաստաթուղթ',
      description: 'Ստեղծել պահանջների փաստաթուղթ նախագծի համար',
      assignedTo: userId,
      status: 'completed',
      completedAt: '2023-09-10'
    },
    {
      id: '2',
      title: 'Նախագծի նախատիպ',
      description: 'Ստեղծել նախագծի նախատիպ',
      assignedTo: userId,
      status: 'in-progress'
    },
    {
      id: '3',
      title: 'Փորձարկում և որակի ապահովում',
      description: 'Կատարել փորձարկում և որակի ապահովում',
      assignedTo: '',
      status: 'todo'
    }
  ];
};
