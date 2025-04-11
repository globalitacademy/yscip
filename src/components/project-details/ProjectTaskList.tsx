
import React, { useState } from 'react';
import { ProjectTheme, Task } from '@/data/projectThemes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  
  const handleAddTask = () => {
    if (!newTaskTitle || !newTaskAssignee) return;
    
    onAddTask({
      title: newTaskTitle,
      description: newTaskDescription,
      assignedTo: newTaskAssignee,
      status: 'todo'
    });
    
    // Reset form
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskAssignee('');
  };
  
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 dark:bg-gray-800';
      case 'inProgress':
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100';
      case 'review':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100';
      case 'done':
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };
  
  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'Անել';
      case 'inProgress':
      case 'in-progress':
        return 'Ընթացքում';
      case 'review':
        return 'Վերանայում';
      case 'done':
      case 'completed':
        return 'Ավարտված';
      default:
        return 'Անհայտ';
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Առաջադրանքներ</h3>
      
      {tasks.length === 0 ? (
        <p className="text-muted-foreground">Այս նախագծի համար դեռ առաջադրանքներ չկան:</p>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex justify-between items-start">
                  <span>{task.title}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                    {getStatusText(task.status)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {task.description || 'Նկարագրություն չկա'}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    Նշանակված: {task.assignedTo}
                  </div>
                  
                  {isEditing && (
                    <Select 
                      value={task.status} 
                      onValueChange={(value) => onUpdateTaskStatus(task.id, value as Task['status'])}
                    >
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue placeholder="Կարգավիճակ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">Անել</SelectItem>
                        <SelectItem value="in-progress">Ընթացքում</SelectItem>
                        <SelectItem value="review">Վերանայում</SelectItem>
                        <SelectItem value="done">Ավարտված</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {isEditing && (
        <div className="space-y-4 border p-4 rounded-lg">
          <h4 className="font-medium">Նոր առաջադրանք</h4>
          
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
            
            <Input 
              placeholder="Նշանակված անձնավորությանը (օր.՝ օգտանուն)" 
              value={newTaskAssignee}
              onChange={(e) => setNewTaskAssignee(e.target.value)}
            />
            
            <Button onClick={handleAddTask} disabled={!newTaskTitle || !newTaskAssignee}>
              Ավելացնել առաջադրանք
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTaskList;
