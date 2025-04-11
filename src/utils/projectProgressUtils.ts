
import { Task, TimelineEvent } from '@/data/projectThemes';
import { v4 as uuidv4 } from 'uuid';

/**
 * Calculate the progress percentage of a project based on completed tasks and timeline events
 * @param tasks Array of project tasks
 * @param timeline Array of timeline events
 * @returns Progress percentage (0-100)
 */
export const calculateProjectProgress = (tasks: Task[], timeline: TimelineEvent[]): number => {
  if (tasks.length === 0 && timeline.length === 0) {
    return 0;
  }

  let completedItems = 0;
  let totalItems = 0;

  // Count completed tasks
  if (tasks.length > 0) {
    totalItems += tasks.length;
    completedItems += tasks.filter(task => 
      task.status === 'done' || 
      task.status === 'completed'
    ).length;
  }

  // Count completed timeline events
  if (timeline.length > 0) {
    totalItems += timeline.length;
    completedItems += timeline.filter(event => event.isCompleted).length;
  }

  // Calculate percentage
  return Math.round((completedItems / totalItems) * 100);
};

/**
 * Generate sample timeline events for demonstration purposes
 */
export const generateSampleTimeline = (): TimelineEvent[] => {
  return [
    {
      id: uuidv4(),
      title: 'Նախագծի սկիզբ',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Նախագծի պլանավորման սկիզբ',
      isCompleted: true
    },
    {
      id: uuidv4(),
      title: 'Նախագծի պահանջների սահմանում',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Պահանջների վերլուծություն և փաստաթղթավորում',
      isCompleted: true
    },
    {
      id: uuidv4(),
      title: 'Դիզայնի փուլ',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Նախագծի դիզայնի մշակում',
      isCompleted: false
    },
    {
      id: uuidv4(),
      title: 'Իրականացման սկիզբ',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Կոդավորման աշխատանքների սկիզբ',
      isCompleted: false
    },
    {
      id: uuidv4(),
      title: 'Թեստավորում',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Նախագծի թեստավորում',
      isCompleted: false
    }
  ];
};

/**
 * Generate sample tasks for demonstration purposes
 * @param userId User ID to assign some tasks to
 */
export const generateSampleTasks = (userId: string): Task[] => {
  return [
    {
      id: uuidv4(),
      title: 'Նախագծի պահանջների վերլուծություն',
      description: 'Հավաքել և վերլուծել բոլոր պահանջները',
      assignedTo: userId,
      status: 'completed'
    },
    {
      id: uuidv4(),
      title: 'Դիզայնի նախագծում',
      description: 'Մշակել նախագծի դիզայնը և նախատիպերը',
      assignedTo: userId,
      status: 'in-progress'
    },
    {
      id: uuidv4(),
      title: 'Տվյալների բազայի մոդելավորում',
      description: 'Մշակել տվյալների բազայի սխեման',
      assignedTo: 'user2',
      status: 'review'
    },
    {
      id: uuidv4(),
      title: 'Օգտագործողի միջերեսի մշակում',
      description: 'Իրականացնել նախագծի գլխավոր էջերը',
      assignedTo: userId,
      status: 'todo'
    }
  ];
};
