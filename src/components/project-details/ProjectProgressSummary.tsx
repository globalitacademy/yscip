
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertCircle, 
  BarChart2 
} from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { cn } from '@/lib/utils';
import { Task, TimelineEvent } from '@/data/projectThemes';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProjectProgressSummary: React.FC = () => {
  const { project, tasks, timeline, projectProgress } = useProject();
  
  if (!project) return null;
  
  // Հաշվարկում ենք վիճակագրությունը
  const completedTasks = tasks.filter(task => 
    task.status === 'done' || task.status === 'completed').length;
  const totalTasks = tasks.length;
  const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const completedEvents = timeline.filter(event => event.isCompleted).length;
  const totalEvents = timeline.length;
  const timelinePercentage = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;
  
  // Ստեղծում ենք առաջխաղացման կարգավիճակը
  const getProgressStatus = () => {
    if (projectProgress >= 75) return 'Լավ առաջընթաց';
    if (projectProgress >= 50) return 'Նորմալ առաջընթաց';
    if (projectProgress >= 25) return 'Վաղ փուլում';
    return 'Նոր սկսված';
  };
  
  const getProgressColor = () => {
    if (projectProgress >= 75) return 'bg-green-500';
    if (projectProgress >= 50) return 'bg-blue-500';
    if (projectProgress >= 25) return 'bg-amber-500';
    return 'bg-gray-500';
  };
  
  // Հաշվարկենք մոտավոր մնացած ժամանակը
  const getDaysRemaining = () => {
    if (!project.duration) return null;
    
    // Պարզ հաշվարկ՝ ելնելով տևողությունից և առաջընթացից
    const durationMatch = project.duration.match(/(\d+)/);
    if (!durationMatch) return null;
    
    const totalDays = parseInt(durationMatch[1]) * 30; // Ամիսները օրերի փոխարկում
    const remainingDays = Math.round(totalDays * (1 - projectProgress / 100));
    
    return remainingDays;
  };
  
  const daysRemaining = getDaysRemaining();
  
  const renderTasksDistribution = () => {
    // Հաշվարկում ենք քանակը ըստ կարգավիճակի
    const todoCount = tasks.filter(t => t.status === 'todo').length;
    const inProgressCount = tasks.filter(t => 
      t.status === 'inProgress' || t.status === 'in-progress').length;
    const reviewCount = tasks.filter(t => t.status === 'review').length;
    const doneCount = tasks.filter(t => 
      t.status === 'done' || t.status === 'completed').length;
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center p-2 rounded bg-muted/50 gap-2">
                <Circle size={14} className="text-slate-500" />
                <div className="text-xs">
                  <div>Նոր</div>
                  <div className="font-bold">{todoCount}</div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Նոր քայլեր, որոնք դեռ չեն սկսվել</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center p-2 rounded bg-muted/50 gap-2">
                <Clock size={14} className="text-blue-500" />
                <div className="text-xs">
                  <div>Ընթացքում</div>
                  <div className="font-bold">{inProgressCount}</div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Քայլեր, որոնք ներկայումս իրականացվում են</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center p-2 rounded bg-muted/50 gap-2">
                <AlertCircle size={14} className="text-amber-500" />
                <div className="text-xs">
                  <div>Վերանայում</div>
                  <div className="font-bold">{reviewCount}</div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Քայլեր, որոնք սպասում են վերանայման</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center p-2 rounded bg-muted/50 gap-2">
                <CheckCircle size={14} className="text-green-500" />
                <div className="text-xs">
                  <div>Ավարտված</div>
                  <div className="font-bold">{doneCount}</div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ավարտված քայլեր</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <BarChart2 size={20} /> Առաջընթացի ամփոփում
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">Ընդհանուր առաջընթաց</div>
            <div className="text-sm font-medium">{projectProgress}%</div>
          </div>
          <Progress value={projectProgress} className={cn("h-2", getProgressColor())} />
          <div className="mt-1 text-xs text-muted-foreground">{getProgressStatus()}</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">Քայլեր</div>
              <div className="text-sm font-medium">{completedTasks}/{totalTasks}</div>
            </div>
            <Progress value={taskPercentage} className="h-2 bg-muted" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">Ժամանակացույց</div>
              <div className="text-sm font-medium">{completedEvents}/{totalEvents}</div>
            </div>
            <Progress value={timelinePercentage} className="h-2 bg-muted" />
          </div>
        </div>
        
        {daysRemaining !== null && (
          <div className="bg-muted/50 p-3 rounded-md flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 text-blue-700">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="text-sm font-medium">Մոտավոր մնացած ժամանակ</h4>
              <p className="text-sm text-muted-foreground">{daysRemaining} օր</p>
            </div>
          </div>
        )}
        
        <div>
          <h3 className="text-sm font-medium mb-1">Քայլերի բաշխում</h3>
          {renderTasksDistribution()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectProgressSummary;
