
import React from 'react';
import { Task } from '@/data/projectThemes';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MoreHorizontal, UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from '@/data/userRoles';

interface TaskStatusColumnProps {
  status: Task['status'];
  tasks: Task[];
  statusText: string;
  statusColor: string;
  onUpdateStatus: (taskId: string, status: Task['status']) => void;
  students: User[];
}

const TaskStatusColumn: React.FC<TaskStatusColumnProps> = ({
  status,
  tasks,
  statusText,
  statusColor,
  onUpdateStatus,
  students
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className={`px-3 py-2 rounded-t-md font-medium text-sm ${statusColor}`}>
        {statusText} ({tasks.length})
      </div>
      <div className="flex-1 bg-accent/30 rounded-b-md p-2 min-h-[300px]">
        {tasks.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground p-4 text-center">
            Այս կարգավիճակում առաջադրանքներ չկան
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => (
              <Card key={task.id} className="p-3 shadow-sm hover:shadow transition-shadow">
                <div className="flex justify-between">
                  <h5 className="font-medium text-sm">{task.title}</h5>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Կարգավիճակ</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {(['todo', 'in-progress', 'review', 'done'] as const)
                        .filter(s => s !== status)
                        .map(s => (
                          <DropdownMenuItem 
                            key={s}
                            onClick={() => onUpdateStatus(task.id, s)}
                          >
                            {getStatusText(s)}
                          </DropdownMenuItem>
                        ))
                      }
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {task.description}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <UserIcon size={12} className="text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {students.find(s => s.id === task.assignedTo)?.name || 'Չնշանակված'}
                    </span>
                  </div>
                  {task.dueDate && (
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Clock size={10} />
                      {new Date(task.dueDate).toLocaleDateString('hy-AM')}
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function getStatusText(status: Task['status']) {
  switch (status) {
    case 'todo': return 'Սպասվող';
    case 'in-progress': return 'Ընթացքի մեջ';
    case 'review': return 'Վերանայում';
    case 'done': return 'Ավարտված';
    default: return 'Սպասվող';
  }
}

export { getStatusText };
export default TaskStatusColumn;
