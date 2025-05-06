
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked';

// Legacy values to ensure backward compatibility
export type CompatibleTaskStatus = TaskStatus | 'todo' | 'inProgress' | 'review' | 'done' | 'open' | 'pending';

export const getTaskStatusIcon = (status: TaskStatus | CompatibleTaskStatus) => {
  switch (status) {
    case 'not_started':
    case 'todo':
    case 'open':
    case 'pending':
      return '⬜';
    case 'in_progress':
    case 'inProgress':
    case 'review':
      return '🔄';
    case 'completed':
    case 'done':
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

// Convert any task status string to a standard TaskStatus
export const normalizeStatus = (status: string | TaskStatus | CompatibleTaskStatus): TaskStatus => {
  switch (status) {
    case 'todo':
    case 'open':
    case 'pending':
      return 'not_started';
    case 'inProgress':
    case 'in-progress':
    case 'review':
      return 'in_progress';
    case 'done':
      return 'completed';
    default:
      return status as TaskStatus;
  }
};

// Group tasks by status
export const groupTasksByStatus = (tasks: any[]) => {
  const result: Record<string, any[]> = {
    'todo': [],
    'in-progress': [],
    'review': [],
    'done': []
  };

  tasks.forEach(task => {
    const status = task.status || 'todo';
    
    if (status === 'not_started' || status === 'todo' || status === 'open' || status === 'pending') {
      result['todo'].push(task);
    } 
    else if (status === 'in_progress' || status === 'inProgress') {
      result['in-progress'].push(task);
    }
    else if (status === 'review') {
      result['review'].push(task);
    }
    else if (status === 'completed' || status === 'done') {
      result['done'].push(task);
    }
    else {
      // Default case
      result['todo'].push(task);
    }
  });

  return result;
};

// Get color for status display
export const getTaskStatusColor = (status: string): string => {
  switch (status) {
    case 'todo':
      return 'bg-gray-100 text-gray-700';
    case 'in-progress':
      return 'bg-blue-100 text-blue-700';
    case 'review':
      return 'bg-amber-100 text-amber-700';
    case 'done':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Get text for status display
export const getTaskStatusText = (status: string): string => {
  switch (status) {
    case 'todo':
      return 'Չսկսված';
    case 'in-progress':
      return 'Ընթացքում է';
    case 'review':
      return 'Վերանայման ենթակա';
    case 'done':
      return 'Ավարտված';
    default:
      return 'Անհայտ';
  }
};
