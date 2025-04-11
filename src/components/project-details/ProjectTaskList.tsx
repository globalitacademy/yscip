
import React, { useState } from 'react';
import { Task } from '@/data/projectThemes';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  PlusCircle, 
  Trash2,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProject } from '@/contexts/ProjectContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProjectTaskListProps {
  tasks: Task[];
  projectMembers: any[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  isEditing?: boolean;
}

const ProjectTaskList: React.FC<ProjectTaskListProps> = ({
  tasks,
  projectMembers,
  addTask,
  updateTaskStatus,
  isEditing = false
}) => {
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('todo');

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'done':
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'inProgress':
      case 'in-progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'review':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'Սպասվում է';
      case 'inProgress':
      case 'in-progress':
        return 'Ընթացքի մեջ';
      case 'review':
        return 'Վերանայման ենթակա';
      case 'done':
      case 'completed':
        return 'Ավարտված';
      default:
        return 'Անհայտ';
    }
  };

  const getStatusBadgeColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-200 text-gray-800';
      case 'inProgress':
      case 'in-progress':
        return 'bg-amber-100 text-amber-800';
      case 'review':
        return 'bg-blue-100 text-blue-800';
      case 'done':
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const handleSubmitNewTask = () => {
    addTask({
      title: newTaskTitle,
      description: newTaskDescription,
      assignedTo: newTaskAssignee,
      status: newTaskStatus,
      createdAt: new Date().toISOString()
    });
    
    setIsAddTaskDialogOpen(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskAssignee('');
    setNewTaskStatus('todo');
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    updateTaskStatus(taskId, newStatus);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Նախագծի առաջադրանքներ</h2>
        
        {isEditing && (
          <Button 
            onClick={() => setIsAddTaskDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Ավելացնել առաջադրանք
          </Button>
        )}
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Այս նախագծի համար առաջադրանքներ դեռևս հասանելի չեն։</p>
            
            {isEditing && (
              <Button 
                onClick={() => setIsAddTaskDialogOpen(true)} 
                variant="outline" 
                className="mt-4"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Ավելացնել առաջին առաջադրանքը
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => (
            <Card key={task.id} className="overflow-hidden">
              <div className={`h-2 ${getStatusBadgeColor(task.status)}`}></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{task.title}</CardTitle>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="outline" className={`${getStatusBadgeColor(task.status)}`}>
                    {getStatusIcon(task.status)} 
                    <span className="ml-1">{getStatusText(task.status)}</span>
                  </Badge>
                  
                  {task.assignedTo && (
                    <div className="flex items-center text-xs text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      {projectMembers.find(m => m.id === task.assignedTo)?.name || 'Չնշված'}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="py-2 text-sm">
                {task.description || <span className="text-muted-foreground italic">Առանց նկարագրության</span>}
                
                {isEditing && (
                  <div className="mt-4 pt-4 border-t">
                    <Label htmlFor={`status-${task.id}`}>Կարգավիճակ</Label>
                    <Select
                      value={task.status}
                      onValueChange={(value) => handleStatusChange(task.id, value as Task['status'])}
                    >
                      <SelectTrigger id={`status-${task.id}`} className="mt-1">
                        <SelectValue placeholder="Ընտրել կարգավիճակ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">Սպասվում է</SelectItem>
                        <SelectItem value="in-progress">Ընթացքի մեջ</SelectItem>
                        <SelectItem value="review">Վերանայման ենթակա</SelectItem>
                        <SelectItem value="done">Ավարտված</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Նոր առաջադրանք</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Վերնագիր</Label>
              <Input
                id="task-title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Առաջադրանքի վերնագիր"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-description">Նկարագրություն</Label>
              <Textarea
                id="task-description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Առաջադրանքի մանրամասն նկարագրություն"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-assignee">Կատարող</Label>
              <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                <SelectTrigger id="task-assignee">
                  <SelectValue placeholder="Ընտրել կատարողին" />
                </SelectTrigger>
                <SelectContent>
                  {projectMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-status">Կարգավիճակ</Label>
              <Select value={newTaskStatus} onValueChange={(value) => setNewTaskStatus(value as Task['status'])}>
                <SelectTrigger id="task-status">
                  <SelectValue placeholder="Ընտրել կարգավիճակ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Սպասվում է</SelectItem>
                  <SelectItem value="in-progress">Ընթացքի մեջ</SelectItem>
                  <SelectItem value="review">Վերանայման ենթակա</SelectItem>
                  <SelectItem value="done">Ավարտված</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddTaskDialogOpen(false)}
            >
              Չեղարկել
            </Button>
            <Button
              onClick={handleSubmitNewTask}
              disabled={!newTaskTitle}
            >
              Ավելացնել
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTaskList;
