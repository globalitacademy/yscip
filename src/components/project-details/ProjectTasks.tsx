import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/data/projectThemes';
import { ListChecks, Check, Clock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskStatus, getTaskStatusColor, getTaskStatusText } from '@/utils/taskUtils';

// Define TaskPriority type
type TaskPriority = 'high' | 'medium' | 'low';

// Update the Task interface or extend it to include any missing properties
interface ExtendedTask extends Task {
  priority?: TaskPriority;
  deadline?: string;
}

interface ProjectTasksProps {
  tasks: ExtendedTask[];
  onAddTask: (task: Omit<ExtendedTask, 'id'>) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  isEditing: boolean;
}

const ProjectTasks: React.FC<ProjectTasksProps> = ({
  tasks,
  onAddTask,
  onUpdateTaskStatus,
  isEditing
}) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // A week from now
    priority: 'medium' as TaskPriority
  });
  const [taskFilter, setTaskFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleAddTask = () => {
    if (!newTask.title) return;
    
    onAddTask({
      title: newTask.title,
      description: newTask.description,
      deadline: new Date(newTask.deadline).toISOString(),
      status: 'todo' as TaskStatus,
      priority: newTask.priority,
      assignedTo: 'current-user' // Placeholder
    });
    
    setNewTask({
      title: '',
      description: '',
      deadline: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      priority: 'medium'
    });
    
    setDialogOpen(false);
  };
  
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Բարձր</Badge>;
      case 'medium':
        return <Badge variant="default">Միջին</Badge>;
      case 'low':
        return <Badge variant="secondary">Ցածր</Badge>;
      default:
        return <Badge variant="default">Միջին</Badge>;
    }
  };
  
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
      case 'done':
        return <Badge className="bg-green-600">Ավարտված</Badge>;
      case 'in-progress':
      case 'inProgress':
      case 'review':
        return <Badge className="bg-blue-600">Ընթացքի մեջ</Badge>;
      case 'pending':
      case 'open':
      case 'todo':
        return <Badge variant="outline">Սպասվող</Badge>;
      default:
        return <Badge variant="outline">Սպասվող</Badge>;
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'all') return true;
    if (taskFilter === 'active') return !['completed', 'done'].includes(task.status as string);
    if (taskFilter === 'completed') return ['completed', 'done'].includes(task.status as string);
    return true;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5" /> Հանձնարարություններ
        </CardTitle>
        
        {isEditing && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" /> Ավելացնել
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Նոր հանձնարարություն</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <Label htmlFor="title">Անվանում</Label>
                  <Input
                    id="title"
                    placeholder="Հանձնարարության անվանում"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Նկարագրություն</Label>
                  <Textarea
                    id="description"
                    placeholder="Հանձնարարության նկարագրություն"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="mt-2"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="deadline">Վերջնաժամկետ</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Առաջնահերթություն</Label>
                  <RadioGroup 
                    defaultValue={newTask.priority} 
                    className="mt-2"
                    onValueChange={(value) => setNewTask({...newTask, priority: value as TaskPriority})}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high">Բարձր</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Միջին</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low">Ցածր</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Չեղարկել</Button>
                </DialogClose>
                <Button onClick={handleAddTask}>Ավելացնել</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="mb-6" onValueChange={(v) => setTaskFilter(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Բոլորը</TabsTrigger>
            <TabsTrigger value="active">Ակտիվ</TabsTrigger>
            <TabsTrigger value="completed">Ավարտված</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div 
                key={task.id}
                className={cn(
                  "border rounded-lg p-4 transition-colors",
                  (task.status === 'completed' || task.status === 'done') ? "bg-muted/30" : ""
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className={cn(
                    "font-medium text-lg",
                    (task.status === 'completed' || task.status === 'done') && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {task.priority && getPriorityBadge(task.priority)}
                    {getStatusBadge(task.status as TaskStatus)}
                  </div>
                </div>
                
                {task.description && (
                  <p className="text-muted-foreground mt-2">{task.description}</p>
                )}
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground flex items-center">
                    {task.deadline && (
                      <>
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Վերջնաժամկետ: {format(new Date(task.deadline), 'dd.MM.yyyy')}
                      </>
                    )}
                  </div>
                  
                  {isEditing && (task.status !== 'completed' && task.status !== 'done') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => onUpdateTaskStatus(task.id, 'done')}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" /> Նշել որպես ավարտված
                    </Button>
                  )}
                  
                  {isEditing && (task.status === 'completed' || task.status === 'done') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => onUpdateTaskStatus(task.id, 'todo')}
                    >
                      Նշել որպես անավարտ
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <p>Հանձնարարություններ չկան</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTasks;
