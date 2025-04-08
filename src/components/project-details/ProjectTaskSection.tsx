
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useProject } from '@/contexts/ProjectContext';
import { CheckCircle, CircleDashed, RotateCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ProjectTaskSection: React.FC = () => {
  const { tasks } = useProject();
  
  // Task status display helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done':
      case 'completed':
        return <Badge variant="success" className="bg-green-100 text-green-800 border-green-200">Ավարտված</Badge>;
      case 'inProgress':
        return <Badge variant="warning" className="bg-amber-100 text-amber-800 border-amber-200">Ընթացքում</Badge>;
      case 'todo':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Պլանավորված</Badge>;
      default:
        return <Badge variant="outline">Անհայտ</Badge>;
    }
  };
  
  // Task status icon helper
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inProgress':
        return <RotateCw className="h-4 w-4 text-amber-600" />;
      default:
        return <CircleDashed className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Հանձնարարություններ</h3>
        
        <div className="space-y-4">
          {tasks && tasks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {tasks.map((task, index) => (
                <div 
                  key={index} 
                  className="p-4 border rounded-md hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <span className="font-medium">{task.title}</span>
                    </div>
                    {getStatusBadge(task.status)}
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-2">{task.description}</p>
                  )}
                  
                  {task.dueDate && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Վերջնաժամկետ: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">Հանձնարարություններ չկան</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTaskSection;
