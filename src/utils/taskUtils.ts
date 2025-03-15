
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/data/projectThemes';

// Task status utilities
export const getTaskStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'todo': return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'review': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'done': return 'bg-green-100 text-green-700 border-green-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export const getTaskStatusText = (status: Task['status']) => {
  switch (status) {
    case 'todo': return 'Սպասվող';
    case 'in-progress': return 'Ընթացքի մեջ';
    case 'review': return 'Վերանայում';
    case 'done': return 'Ավարտված';
    default: return 'Սպասվող';
  }
};

export const groupTasksByStatus = (tasks: Task[]) => {
  return {
    todo: tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    review: tasks.filter(task => task.status === 'review'),
    done: tasks.filter(task => task.status === 'done')
  };
};

export class TaskUtils {
  static createTask(title: string, description: string, assignedTo: string): Task {
    return {
      id: uuidv4(),
      title,
      description,
      status: 'todo',
      assignedTo
    };
  }

  static updateTaskStatus(tasks: Task[], taskId: string, newStatus: Task['status']): Task[] {
    return tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
  }
}
