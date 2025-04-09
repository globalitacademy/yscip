
import React from 'react';
import { Task } from '@/data/projectThemes';
import { User } from '@/data/userRoles';
import { Card } from '@/components/ui/card';
import { 
  Calendar,
  ArrowLeft,
  ArrowRight,
  User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskStatusColumnProps {
  status: 'todo' | 'in-progress' | 'review' | 'done';
  statusText: string;
  statusColor: string;
  tasks: Task[];
  onUpdateStatus?: (taskId: string, status: Task['status']) => void;
  students: User[];
  isEditing?: boolean; // Add isEditing prop
}

const TaskStatusColumn: React.FC<TaskStatusColumnProps> = ({
  status,
  statusText,
  statusColor,
  tasks = [],
  onUpdateStatus,
  students,
  isEditing = false // Set default value to false
}) => {
  const getStudentName = (id: string) => {
    const student = students.find(s => s.id === id);
    return student ? student.name : 'Անանուն';
  };
  
  const canMoveLeft = status !== 'todo';
  const canMoveRight = status !== 'done';
  
  const getPreviousStatus = (): Task['status'] => {
    switch(status) {
      case 'in-progress': return 'todo';
      case 'review': return 'in-progress';
      case 'done': return 'review';
      default: return 'todo';
    }
  };
  
  const getNextStatus = (): Task['status'] => {
    switch(status) {
      case 'todo': return 'in-progress';
      case 'in-progress': return 'review';
      case 'review': return 'done';
      default: return 'done';
    }
  };
  
  const handleMoveLeft = (taskId: string) => {
    if (onUpdateStatus && canMoveLeft) {
      onUpdateStatus(taskId, getPreviousStatus());
    }
  };
  
  const handleMoveRight = (taskId: string) => {
    if (onUpdateStatus && canMoveRight) {
      onUpdateStatus(taskId, getNextStatus());
    }
  };

  return (
    <div>
      <div 
        className={`p-2 rounded-t-md font-medium text-sm mb-2 text-center ${statusColor}`}
      >
        {statusText} ({tasks.length})
      </div>
      
      <div className="space-y-3 min-h-[200px]">
        {tasks.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-md h-24 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Առաջադրանքներ չկան</p>
          </div>
        ) : (
          tasks.map(task => (
            <Card key={task.id} className="p-3 shadow-sm">
              <h4 className="font-medium text-sm mb-1">{task.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {task.description}
              </p>
              
              {task.assignedTo && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <UserIcon size={12} />
                  <span>{getStudentName(task.assignedTo)}</span>
                </div>
              )}
              
              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <Calendar size={12} />
                  <span>{new Date(task.dueDate).toLocaleDateString('hy-AM')}</span>
                </div>
              )}
              
              {(onUpdateStatus || isEditing) && (
                <div className="flex justify-between mt-2 pt-2 border-t border-border">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs"
                    disabled={!canMoveLeft}
                    onClick={() => handleMoveLeft(task.id)}
                  >
                    <ArrowLeft size={14} />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs"
                    disabled={!canMoveRight}
                    onClick={() => handleMoveRight(task.id)}
                  >
                    <ArrowRight size={14} />
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskStatusColumn;
