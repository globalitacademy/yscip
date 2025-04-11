
import { v4 as uuidv4 } from 'uuid';
import { Task, TimelineEvent } from '@/data/projectThemes';

/**
 * Calculate the project progress based on tasks and timeline events
 */
export const calculateProjectProgress = (tasks: Task[], timeline: TimelineEvent[]): number => {
  if (tasks.length === 0 && timeline.length === 0) {
    return 0;
  }

  let totalItems = tasks.length + timeline.length;
  let completedItems = 0;

  // Count completed tasks
  completedItems += tasks.filter(task => 
    ['done', 'completed'].includes(task.status)
  ).length;

  // Count completed timeline events
  completedItems += timeline.filter(event => 
    event.isCompleted
  ).length;

  const progress = Math.round((completedItems / totalItems) * 100);
  return Math.min(100, Math.max(0, progress)); // Ensure between 0-100
};

/**
 * Generate sample timeline events for demo purposes
 */
export const generateSampleTimeline = (): TimelineEvent[] => {
  return [
    {
      id: uuidv4(),
      title: 'Նախագծի սկիզբ',
      date: new Date().toISOString(),
      isCompleted: true,
      description: 'Նախագիծը սկսված է'
    },
    {
      id: uuidv4(),
      title: 'Նախագծի պահանջների հավաքում',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false,
      description: 'Նախագծի պահանջների հավաքման փուլ'
    },
    {
      id: uuidv4(),
      title: 'Նախագծի ավարտ',
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false,
      description: 'Նախագծի ավարտման վերջնաժամկետ'
    }
  ];
};

/**
 * Generate sample tasks for demo purposes
 */
export const generateSampleTasks = (userId: string): Task[] => {
  return [
    {
      id: uuidv4(),
      title: 'Նախագծի պլանավորում',
      description: 'Մշակել նախագծի ընդհանուր պլանը և ժամանակացույցը',
      assignedTo: userId,
      status: 'done'
    },
    {
      id: uuidv4(),
      title: 'Ֆունկցիոնալ պահանջների նկարագրություն',
      description: 'Կազմել ֆունկցիոնալ պահանջների նկարագրությունը',
      assignedTo: userId,
      status: 'inProgress'
    },
    {
      id: uuidv4(),
      title: 'Նախագծի իրականացում',
      description: 'Նախագծի հիմնական մասի իրականացում',
      assignedTo: userId,
      status: 'todo'
    }
  ];
};
