
import React, { useState } from 'react';
import { Task } from '@/data/projectThemes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Circle,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectTaskListProps {
  tasks: Task[];
  isEditing: boolean;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTaskStatus: (taskId: string, status: Task['status']) => void;
}

const ProjectTaskList: React.FC<ProjectTaskListProps> = ({ 
  tasks, 
  isEditing,
  onAddTask,
  onUpdateTaskStatus
}) => {
  const { user } = useAuth();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(user?.id || '');
  
  const handleAddTask = () => {
    if (!newTaskTitle) return;
    
    onAddTask({
      title: newTaskTitle,
      description: newTaskDescription,
      assignedTo: newTaskAssignee,
      status: 'todo'
    });
    
    setNewTaskTitle('');
    setNewTaskDescription('');
  };
  
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return <Circle className="h-5 w-5 text-gray-400" />;
      case 'inProgress':
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'review':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'done':
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'Սպասվող';
      case 'inProgress':
      case 'in-progress':
        return 'Ընթացքի մեջ';
      case 'review':
        return 'Ստուգման';
      case 'done':
      case 'completed':
        return 'Ավարտված';
      default:
        return 'Անհայտ';
    }
  };
  
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'inProgress':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'review':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'done':
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Առաջադրանքներ</CardTitle>
      </CardHeader>
      
      <CardContent>
        {tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map(task => (
              <div 
                key={task.id}
                className="border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getStatusIcon(task.status)}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{task.title}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="text-muted-foreground mt-1 text-sm">{task.description}</p>
                    )}
                    
                    {user && (task.assignedTo === user.id || isEditing) && (
                      <div className="mt-3">
                        <Select 
                          value={task.status} 
                          onValueChange={(value) => onUpdateTaskStatus(task.id, value as Task['status'])}
                          disabled={!isEditing && task.assignedTo !== user.id}
                        >
                          <SelectTrigger className="w-[180px] h-8 text-xs">
                            <SelectValue placeholder="Կարգավիճակ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todo">Սպասվող</SelectItem>
                            <SelectItem value="in-progress">Ընթացքի մեջ</SelectItem>
                            <SelectItem value="review">Ստուգման</SelectItem>
                            <SelectItem value="done">Ավարտված</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Առաջադրանքներ դեռ չկան</p>
          </div>
        )}
        
        {isEditing && (
          <div className="mt-6 border-t pt-4">
            <h4 className="font-medium mb-3">Նոր առաջադրանք</h4>
            <div className="space-y-3">
              <Input 
                placeholder="Առաջադրանքի վերնագիր" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              
              <Textarea 
                placeholder="Նկարագրություն" 
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                rows={3}
              />
              
              <div className="flex gap-3 items-center">
                <Button 
                  onClick={handleAddTask} 
                  className="flex items-center gap-2" 
                  disabled={!newTaskTitle}
                >
                  <Plus className="h-4 w-4" />
                  Ավելացնել առաջադրանք
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTaskList;
