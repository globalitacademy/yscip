
import React from 'react';
import { Task } from '@/data/projectThemes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { getInitials } from '@/utils/userUtils';

interface TaskStatusColumnProps {
  status: 'todo' | 'in-progress' | 'review' | 'done';
  statusText: string;
  statusColor: string;
  tasks: Task[];
  onUpdateStatus?: (taskId: string, status: Task['status']) => void;
  students: any[];
}

const TaskStatusColumn: React.FC<TaskStatusColumnProps> = ({
  status,
  statusText,
  statusColor,
  tasks,
  onUpdateStatus,
  students
}) => {
  const canMovePrevious = (taskStatus: string) => {
    return taskStatus !== 'todo' && taskStatus !== 'open';
  };

  const canMoveNext = (taskStatus: string) => {
    return taskStatus !== 'done';
  };

  const moveTaskStatus = (task: Task, direction: 'prev' | 'next') => {
    if (!onUpdateStatus) return;

    // Map between different status formats based on direction
    if (direction === 'prev') {
      if (task.status === 'in-progress' || task.status === 'in progress') {
        onUpdateStatus(task.id, 'todo');
      } else if (task.status === 'review') {
        onUpdateStatus(task.id, 'in-progress');
      } else if (task.status === 'done') {
        onUpdateStatus(task.id, 'review');
      }
    } else if (direction === 'next') {
      if (task.status === 'todo' || task.status === 'open') {
        onUpdateStatus(task.id, 'in-progress');
      } else if (task.status === 'in-progress' || task.status === 'in progress') {
        onUpdateStatus(task.id, 'review');
      } else if (task.status === 'review') {
        onUpdateStatus(task.id, 'done');
      }
    }
  };

  const getStudentName = (assigneeId: string) => {
    const student = students.find(s => s.id === assigneeId);
    return student ? student.name : 'Unknown';
  };

  return (
    <div className="rounded-md border border-border">
      <div className={`p-3 rounded-t-md ${statusColor}`}>
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{statusText}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-background/80">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div className="p-3 space-y-2" style={{ minHeight: '200px' }}>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Այս կարգավիճակում առաջադրանքներ չկան
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="p-3 bg-card rounded-md border border-border shadow-sm">
              <div className="mb-2 font-medium">{task.title}</div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {task.description}
              </p>
              
              <div className="flex justify-between items-center mt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-xs">
                            {getInitials(getStudentName(task.assignee || task.assignedTo || ''))}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getStudentName(task.assignee || task.assignedTo || '')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <div className="flex items-center gap-1">
                  {canMovePrevious(task.status) && onUpdateStatus && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => moveTaskStatus(task, 'prev')}
                      title="Նախորդ կարգավիճակ"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {canMoveNext(task.status) && onUpdateStatus && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => moveTaskStatus(task, 'next')}
                      title="Հաջորդ կարգավիճակ"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {task.status === 'done' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskStatusColumn;
