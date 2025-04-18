
import React, { useState } from 'react';
import { Task } from '@/data/projectThemes';
import { getCurrentUser, getUsersByRole, rolePermissions } from '@/data/userRoles';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import TaskStatusColumn from './TaskStatusColumn';
import TaskForm from './TaskForm';
import { getTaskStatusColor, getTaskStatusText, groupTasksByStatus, normalizeStatus } from '@/utils/taskUtils';

interface TaskManagerProps {
  tasks: Task[];
  onAddTask?: (task: Omit<Task, 'id'>) => void;
  onUpdateTaskStatus?: (taskId: string, status: Task['status']) => void;
  isEditing?: boolean; // Add isEditing prop
}

const TaskManager: React.FC<TaskManagerProps> = ({ 
  tasks = [],
  onAddTask,
  onUpdateTaskStatus,
  isEditing = false  // Set default value to false
}) => {
  const currentUser = getCurrentUser();
  const permissions = rolePermissions[currentUser.role];
  const [open, setOpen] = useState(false);
  const students = getUsersByRole('student');

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    if (onAddTask) {
      onAddTask(task);
      toast({
        title: "Առաջադրանքն ավելացված է",
        description: "Նոր առաջադրանքը հաջողությամբ ավելացվեց։",
      });
    }
  };

  const updateStatus = (taskId: string, status: Task['status']) => {
    if (onUpdateTaskStatus) {
      onUpdateTaskStatus(taskId, status);
      toast({
        title: "Առաջադրանքի կարգավիճակը թարմացված է",
        description: "Առաջադրանքի կարգավիճակը հաջողությամբ փոխվեց։",
      });
    }
  };

  const tasksByStatus = groupTasksByStatus(tasks);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Առաջադրանքներ</h3>
        {(permissions.canAddTasks || isEditing) && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus size={16} /> Ավելացնել առաջադրանք
              </Button>
            </DialogTrigger>
            <TaskForm 
              onSubmit={handleAddTask}
              onClose={() => setOpen(false)}
              currentUserId={currentUser.id}
              students={students}
            />
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['todo', 'in-progress', 'review', 'done'] as const).map(status => (
          <TaskStatusColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            statusText={getTaskStatusText(status)}
            statusColor={getTaskStatusColor(status)}
            onUpdateStatus={updateStatus}
            students={students}
            isEditing={isEditing}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
