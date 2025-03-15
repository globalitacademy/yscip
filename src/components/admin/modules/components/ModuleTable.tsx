
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash, CheckCircle, Clock, XCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pb-2 text-left font-medium">ID</th>
            <th className="pb-2 text-left font-medium">Անվանում</th>
            <th className="pb-2 text-left font-medium">Կարգավիճակ</th>
            <th className="pb-2 text-left font-medium">Առաջընթաց</th>
            <th className="pb-2 text-left font-medium">Թեմաներ</th>
            <th className="pb-2 text-right font-medium">Գործողություններ</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((module) => (
            <tr key={module.id} className="border-b hover:bg-muted/50">
              <td className="py-3">{module.id}</td>
              <td className="py-3">
                <div className="flex flex-col">
                  <span>{module.title}</span>
                  {module.description && (
                    <span className="text-xs text-muted-foreground line-clamp-1">{module.description}</span>
                  )}
                </div>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(module.status || 'not-started')}
                  <span>{getStatusLabel(module.status || 'not-started')}</span>
                </div>
              </td>
              <td className="py-3 w-[200px]">
                <div className="flex items-center gap-3">
                  <Progress value={module.progress || 0} className="h-2 flex-grow" />
                  <span className="text-xs whitespace-nowrap">{module.progress || 0}%</span>
                </div>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{module.topics?.length || 0}</span>
                  {module.topics && module.topics.length > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="flex flex-wrap gap-1 max-w-[250px]">
                            {module.topics.map((topic, index) => (
                              <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </td>
              <td className="py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEditClick(module)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDeleteClick(module)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModuleTable;
