
import React from 'react';
import { Circle, Clock, AlertCircle, CheckCircle, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Task } from '@/data/projectThemes';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

interface TaskDistributionProps {
  tasks: Task[];
}

const TaskDistribution: React.FC<TaskDistributionProps> = ({ tasks }) => {
  const isMobile = useIsMobile();
  
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
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
        <BarChart2 size={14} /> Քայլերի բաշխում
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {categories.map((category, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className={cn(
                    "flex items-center rounded bg-white dark:bg-zinc-800 shadow-sm border border-muted/30",
                    "transition-all duration-300 ease-in-out hover:shadow-md",
                    "w-full h-full",
                    isMobile 
                      ? "p-2 gap-1.5 flex-col justify-center items-center text-center" 
                      : "p-2.5 gap-2.5 flex-row items-center"
                  )}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={cn(
                    "rounded-full bg-muted/50",
                    isMobile ? "p-1.5 mb-1" : "p-1.5"
                  )}>
                    {category.icon}
                  </div>
                  <div className={cn(
                    "text-xs",
                    isMobile ? "flex flex-col items-center" : ""
                  )}>
                    <div className="text-muted-foreground">{category.name}</div>
                    <div className={cn(
                      "font-bold",
                      isMobile ? "text-lg mt-0.5" : "text-base"
                    )}>{category.count}</div>
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
    </div>
  );
};

export default TaskDistribution;
