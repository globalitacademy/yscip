
import { v4 as uuidv4 } from 'uuid';
import { Task, TimelineEvent } from '@/data/projectThemes';

// Calculate project progress based on tasks and timeline
export const calculateProjectProgress = (tasks: Task[], timeline: TimelineEvent[]): number => {
  if (tasks.length === 0 && timeline.length === 0) return 0;
  
  let completedItems = 0;
  let totalItems = 0;
  
  // Count completed tasks
  if (tasks.length > 0) {
    totalItems += tasks.length;
    completedItems += tasks.filter(task => task.status === 'done').length;
  }
  
  // Count completed timeline events
  if (timeline.length > 0) {
    totalItems += timeline.length;
    completedItems += timeline.filter(event => event.completed).length;
  }
  
  return Math.round((completedItems / totalItems) * 100);
};

// Generate sample timeline events for demo
export const generateSampleTimeline = (): TimelineEvent[] => {
  const now = new Date();
  const oneWeekLater = new Date(now);
  oneWeekLater.setDate(now.getDate() + 7);
  
  const twoWeeksLater = new Date(now);
  twoWeeksLater.setDate(now.getDate() + 14);
  
  return [
    {
      id: uuidv4(),
      title: 'Նախագծի մեկնարկ',
      date: now.toISOString().split('T')[0],
      description: 'Նախագծի պահանջների քննարկում և պլանավորում',
      completed: true
    },
    {
      id: uuidv4(),
      title: 'Ծրագրային պահանջների կազմում',
      date: oneWeekLater.toISOString().split('T')[0],
      description: 'Ծրագրային պահանջների վերլուծություն և փաստաթղթավորում',
      completed: false
    },
    {
      id: uuidv4(),
      title: 'Նախնական նախատիպի ստեղծում',
      date: twoWeeksLater.toISOString().split('T')[0],
      description: 'Նախագծի նախնական տարբերակի մշակում',
      completed: false
    }
  ];
};

// Generate sample tasks for demo
export const generateSampleTasks = (userId: string): Task[] => {
  return [
    {
      id: uuidv4(),
      title: 'Տեխնիկական առաջադրանքի կազմում',
      description: 'Նախագծի տեխնիկական առաջադրանքի մշակում և կազմում',
      status: 'done',
      assignedTo: userId
    },
    {
      id: uuidv4(),
      title: 'Ճարտարապետության մշակում',
      description: 'Նախագծի ճարտարապետության նախագծում և սխեմատիկ պատկերում',
      status: 'in-progress',
      assignedTo: userId
    },
    {
      id: uuidv4(),
      title: 'UI/UX դիզայն',
      description: 'Օգտագործողի միջերեսի նախատիպի մշակում',
      status: 'todo',
      assignedTo: userId
    }
  ];
};
