
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/data/projectThemes';
import { getUsersByRole } from '@/data/userRoles';

// Define a consistent TaskStatus type to use across the application
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'pending' | 'open' | 'inProgress' | 'completed' | 'backlog';

// Task status utilities
export const getTaskStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'todo': 
    case 'open':
    case 'pending':
    case 'backlog': return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'inProgress': 
    case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'review': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'done':
    case 'completed': return 'bg-green-100 text-green-700 border-green-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export const getTaskStatusText = (status: TaskStatus) => {
  switch (status) {
    case 'todo':
    case 'open':
    case 'pending':
    case 'backlog': return 'Սպասվող';
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
    todo: tasks.filter(task => ['todo', 'open', 'pending', 'backlog'].includes(task.status as string)),
    'in-progress': tasks.filter(task => ['inProgress', 'in-progress'].includes(task.status as string)),
    review: tasks.filter(task => task.status === 'review'),
    done: tasks.filter(task => ['done', 'completed'].includes(task.status as string))
  };
};

// Map status between different formats
export const normalizeStatus = (status: TaskStatus): 'todo' | 'in-progress' | 'review' | 'done' => {
  if (['open', 'pending', 'todo', 'backlog'].includes(status)) return 'todo';
  if (['inProgress', 'in-progress'].includes(status)) return 'in-progress';
  if (['completed', 'done'].includes(status)) return 'done';
  if (status === 'review') return 'review';
  return 'todo'; // Default case
};

export class TaskUtils {
  static createTask(title: string, description: string, assignedTo: string): Task {
    return {
      id: uuidv4(),
      title,
      description,
      status: 'todo' as TaskStatus,
      assignee: assignedTo,
      assignedTo,
      dueDate: new Date().toISOString().split('T')[0]
    };
  }

  static updateTaskStatus(tasks: Task[], taskId: string, newStatus: TaskStatus): Task[] {
    return tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
  }

  // Use the shared normalizeStatus function
  static normalizeStatus = normalizeStatus;
}
