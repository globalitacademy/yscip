
import React from 'react';
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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pb-2 text-left font-medium">ID</th>
            <th className="pb-2 text-left font-medium">Անվանում</th>
            <th className="pb-2 text-left font-medium">Կարգավիճակ</th>
            <th className="pb-2 text-left font-medium">Առաջընթաց</th>
            <th className="pb-2 text-right font-medium">Գործողություններ</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((module) => (
            <tr key={module.id} className="border-b hover:bg-muted/50">
              <td className="py-3">{module.id}</td>
              <td className="py-3">{module.title}</td>
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
