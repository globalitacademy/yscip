
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { EducationalModule } from '@/components/educationalCycle';

interface ModuleTableProps {
  modules: EducationalModule[];
  onEditClick: (module: EducationalModule) => void;
  onDeleteClick: (module: EducationalModule) => void;
}

const ModuleTable: React.FC<ModuleTableProps> = ({ 
  modules, 
  onEditClick, 
  onDeleteClick 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'not-started':
      default:
        return <XCircle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Ավարտված է';
      case 'in-progress':
        return 'Ընթացքի մեջ է';
      case 'not-started':
      default:
        return 'Չսկսված';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modules.map((module) => (
        <Card key={module.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{module.title}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2 mb-3">
              {getStatusIcon(module.status || 'not-started')}
              <span>{getStatusLabel(module.status || 'not-started')}</span>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={module.progress || 0} className="h-2 flex-grow" />
              <span className="text-xs whitespace-nowrap">{module.progress || 0}%</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onEditClick(module)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDeleteClick(module)}>
              <Trash className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ModuleTable;
