
import React, { useState } from 'react';
import { Task } from '@/data/projectThemes';
import { User, UserRole, getCurrentUser, getUsersByRole, rolePermissions } from '@/data/userRoles';
import { 
  CheckCircle, 
  ClipboardList, 
  Clock, 
  ListChecks, 
  MoreHorizontal, 
  Plus, 
  User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";

interface TaskManagerProps {
  tasks: Task[];
  onAddTask?: (task: Omit<Task, 'id'>) => void;
  onUpdateTaskStatus?: (taskId: string, status: Task['status']) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ 
  tasks = [],
  onAddTask,
  onUpdateTaskStatus
}) => {
  const currentUser = getCurrentUser();
  const permissions = rolePermissions[currentUser.role];
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo' as const,
    assignedTo: '',
    dueDate: ''
  });

  const students = getUsersByRole('student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddTask) {
      onAddTask({
        ...newTask,
        createdBy: currentUser.id,
      });
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        assignedTo: '',
        dueDate: ''
      });
      setOpen(false);
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

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'review': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'done': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'Սպասվող';
      case 'in-progress': return 'Ընթացքի մեջ';
      case 'review': return 'Վերանայում';
      case 'done': return 'Ավարտված';
      default: return 'Սպասվող';
    }
  };

  const tasksByStatus = {
    todo: tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    review: tasks.filter(task => task.status === 'review'),
    done: tasks.filter(task => task.status === 'done')
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Առաջադրանքներ</h3>
        {permissions.canAddTasks && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus size={16} /> Ավելացնել առաջադրանք
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Նոր առաջադրանք</DialogTitle>
                <DialogDescription>
                  Ավելացրեք նոր առաջադրանք պրոեկտի համար։
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Վերնագիր</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Նկարագրություն</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Վերջնաժամկետ</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="assignee">Նշանակված ուսանող</Label>
                    <Select 
                      onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                      defaultValue={newTask.assignedTo}
                    >
                      <SelectTrigger id="assignee">
                        <SelectValue placeholder="Ընտրեք ուսանող" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map(student => (
                          <SelectItem key={student.id} value={student.id} className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={student.avatar} alt={student.name} />
                                <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span>{student.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Ավելացնել</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['todo', 'in-progress', 'review', 'done'] as const).map(status => (
          <div key={status} className="flex flex-col h-full">
            <div className={`px-3 py-2 rounded-t-md font-medium text-sm ${getStatusColor(status)}`}>
              {getStatusText(status)} ({tasksByStatus[status].length})
            </div>
            <div className="flex-1 bg-accent/30 rounded-b-md p-2 min-h-[300px]">
              {tasksByStatus[status].length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground p-4 text-center">
                  Այս կարգավիճակում առաջադրանքներ չկան
                </div>
              ) : (
                <div className="space-y-2">
                  {tasksByStatus[status].map(task => (
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
                                  onClick={() => updateStatus(task.id, s)}
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
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
