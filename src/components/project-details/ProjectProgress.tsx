
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';

interface ProjectProgressProps {
  progressPercentage: number;
}

const ProjectProgress: React.FC<ProjectProgressProps> = ({ progressPercentage }) => {
  return (
    <div className="space-y-3">
      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
        <CheckCircle size={14} className="mr-1" /> Այս պրոեկտն ամրագրված է
      </Badge>
      
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Պրոեկտի առաջադիմություն</span>
          <span className="text-sm font-medium">{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2 w-full" />
      </div>
    </div>
  );
};

export default ProjectProgress;
