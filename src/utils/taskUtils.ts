
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/data/projectThemes';
import { getUsersByRole } from '@/data/userRoles';

// Task status utilities
export const getTaskStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'todo': return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'inProgress': 
    case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'review': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'done':
    case 'completed': return 'bg-green-100 text-green-700 border-green-200';
    case 'open': return 'bg-slate-100 text-slate-700 border-slate-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export const getTaskStatusText = (status: Task['status']) => {
  switch (status) {
    case 'todo':
    case 'open': return 'Սպասվող';
    case 'inProgress':
    case 'in-progress': return 'Ընթացքի մեջ';
    case 'review': return 'Վերանայում';
    case 'done':
    case 'completed': return 'Ավարտված';
    default: return 'Սպասվող';
  }
};

export const groupTasksByStatus = (tasks: Task[]) => {
  return {
    todo: tasks.filter(task => task.status === 'todo' || task.status === 'open'),
    'in-progress': tasks.filter(task => task.status === 'inProgress' || task.status === 'in-progress'),
    review: tasks.filter(task => task.status === 'review'),
    done: tasks.filter(task => task.status === 'done' || task.status === 'completed')
  };
};

// Map status between different formats
export const normalizeStatus = (status: Task['status']): 'todo' | 'in-progress' | 'review' | 'done' => {
  if (status === 'open') return 'todo';
  if (status === 'inProgress' || status === 'in progress') return 'in-progress';
  if (status === 'completed') return 'done';
  if (['todo', 'in-progress', 'review', 'done'].includes(status as string)) {
    return status as 'todo' | 'in-progress' | 'review' | 'done';
  }
  return 'todo'; // Default case
};

export class TaskUtils {
  static createTask(title: string, description: string, assignedTo: string): Task {
    return {
      id: uuidv4(),
      title,
      description,
      status: 'todo',
      assignee: assignedTo,
      assignedTo,
      dueDate: new Date().toISOString().split('T')[0]
    };
  }

  static updateTaskStatus(tasks: Task[], taskId: string, newStatus: Task['status']): Task[] {
    return tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
  }

  // Use the shared normalizeStatus function
  static normalizeStatus = normalizeStatus;
}
