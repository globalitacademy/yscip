
import { Task } from '@/data/projectThemes';

export function getStatusColor(status: Task['status']) {
  switch (status) {
    case 'todo': return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'review': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'done': return 'bg-green-100 text-green-700 border-green-200';
    case 'open': return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'in progress': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'completed': return 'bg-green-100 text-green-700 border-green-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function getStatusText(status: Task['status']) {
  switch (status) {
    case 'todo': return 'Սպասվող';
    case 'in-progress': return 'Ընթացքի մեջ';
    case 'review': return 'Վերանայում';
    case 'done': return 'Ավարտված';
    case 'open': return 'Սպասվող';
    case 'in progress': return 'Ընթացքի մեջ';
    case 'completed': return 'Ավարտված';
    default: return 'Սպասվող';
  }
}

export function groupTasksByStatus(tasks: Task[]) {
  return {
    todo: tasks.filter(task => task.status === 'todo' || task.status === 'open'),
    'in-progress': tasks.filter(task => task.status === 'in-progress' || task.status === 'in progress'),
    review: tasks.filter(task => task.status === 'review'),
    done: tasks.filter(task => task.status === 'done' || task.status === 'completed')
  };
}

// Map status between different formats
export function normalizeStatus(status: Task['status']): 'todo' | 'in-progress' | 'review' | 'done' {
  if (status === 'open') return 'todo';
  if (status === 'in progress') return 'in-progress';
  if (status === 'completed') return 'done';
  if (status === 'todo' || status === 'in-progress' || status === 'review' || status === 'done') {
    return status;
  }
  return 'todo'; // Default case
}
