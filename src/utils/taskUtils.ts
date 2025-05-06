
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked';

export const getTaskStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case 'not_started':
      return '⬜';
    case 'in_progress':
      return '🔄';
    case 'completed':
      return '✅';
    case 'blocked':
      return '🚫';
    default:
      return '❓';
  }
};

export const taskStatusLabels: Record<TaskStatus, string> = {
  'not_started': 'Չսկսված',
  'in_progress': 'Ընթացքում է',
  'completed': 'Ավարտված',
  'blocked': 'Արգելափակված'
};
