
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertCircle,
  BarChart2,
  TrendingUp 
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
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

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
    
    const categories = [
      {
        name: "Նոր",
        count: todoCount,
        icon: <Circle size={14} className="text-slate-500" />,
        tooltip: "Նոր քայլեր, որոնք դեռ չեն սկսվել"
      },
      {
        name: "Ընթացքում",
        count: inProgressCount,
        icon: <Clock size={14} className="text-blue-500" />,
        tooltip: "Քայլեր, որոնք ներկայումս իրականացվում են"
      },
      {
        name: "Վերանայում",
        count: reviewCount,
        icon: <AlertCircle size={14} className="text-amber-500" />,
        tooltip: "Քայլեր, որոնք սպասում են վերանայման"
      },
      {
        name: "Ավարտված",
        count: doneCount,
        icon: <CheckCircle size={14} className="text-green-500" />,
        tooltip: "Ավարտված քայլեր"
      }
    ];
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
        {categories.map((category, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="flex items-center p-2.5 rounded bg-white dark:bg-zinc-800 shadow-sm border border-muted/30 gap-2.5"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-1.5 rounded-full bg-muted/50">
                    {category.icon}
                  </div>
                  <div className="text-xs">
                    <div className="text-muted-foreground">{category.name}</div>
                    <div className="font-bold text-base">{category.count}</div>
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{category.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  };

  const progressVariants = {
    hidden: { width: '0%' },
    visible: (i: number) => ({
      width: `${i}%`,
      transition: { duration: 1, ease: "easeOut" }
    })
  };
  
  return (
    <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
      <CardHeader className="flex items-start flex-row justify-between">
        <CardTitle className="text-xl flex items-center gap-2 text-primary dark:text-primary-foreground">
          <TrendingUp size={20} /> Առաջընթացի ամփոփում
        </CardTitle>
        <div className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1.5">
          <BarChart2 size={12} />
          {getProgressStatus()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">Ընդհանուր առաջընթաց</div>
              <div className="text-sm font-medium">{projectProgress}%</div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full", getProgressColor())}
                custom={projectProgress}
                variants={progressVariants}
              />
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <motion.div variants={fadeInUp}>
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium flex items-center gap-1.5">
                  <CheckCircle size={14} /> Քայլեր
                </div>
                <div className="text-sm font-medium">{completedTasks}/{totalTasks}</div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  custom={taskPercentage}
                  variants={progressVariants}
                />
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium flex items-center gap-1.5">
                  <Clock size={14} /> Ժամանակացույց
                </div>
                <div className="text-sm font-medium">{completedEvents}/{totalEvents}</div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  custom={timelinePercentage}
                  variants={progressVariants}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {daysRemaining !== null && (
          <motion.div 
            className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg flex items-center gap-4 border border-blue-100 dark:border-blue-900"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <div className="p-2.5 rounded-full bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-200">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Մոտավոր մնացած ժամանակ</h4>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-200">{daysRemaining} օր</p>
            </div>
          </motion.div>
        )}
        
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <BarChart size={14} /> Քայլերի բաշխում
          </h3>
          {renderTasksDistribution()}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ProjectProgressSummary;
