
import React from 'react';
import { BarChart, CheckCircle, Clock, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ProjectProgressSummaryProps {
  progress: number;
  completedTasks: number;
  totalTasks: number;
  className?: string;
}

const ProjectProgressSummary: React.FC<ProjectProgressSummaryProps> = ({
  progress,
  completedTasks,
  totalTasks,
  className
}) => {
  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart size={18} className="text-muted-foreground" />
            <h3 className="font-medium text-sm">Ընդհանուր առաջընթաց</h3>
          </div>
          <span className="font-medium text-sm">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <CheckCircle size={18} className="text-green-500 mt-0.5" />
          <div>
            <p className="font-medium text-sm">Ավարտված առաջադրանքներ</p>
            <p className="text-muted-foreground text-sm">{completedTasks} / {totalTasks}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Clock size={18} className="text-amber-500 mt-0.5" />
          <div>
            <p className="font-medium text-sm">Ընթացիկ փուլ</p>
            <p className="text-muted-foreground text-sm">
              {progress < 100 ? 'Ընթացքի մեջ' : 'Ավարտված'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressSummary;
