import React from 'react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';
import { Task, TimelineEvent } from '@/data/projectThemes';
import { normalizeStatus } from '@/utils/taskUtils';

const progressVariants = {
  hidden: { width: '0%' },
  visible: (i: number) => ({
    width: `${i}%`,
    transition: { duration: 1, ease: "easeOut" }
  })
};

interface ProgressBarsProps {
  tasks: Task[];
  timeline: TimelineEvent[];
  projectProgress: number;
  progressColor: string;
}

const ProgressBars: React.FC<ProgressBarsProps> = ({ 
  tasks, 
  timeline, 
  projectProgress,
  progressColor 
}) => {
  // Calculate statistics
  const completedTasks = tasks.filter(task => 
    normalizeStatus(task.status) === 'completed').length;
  const totalTasks = tasks.length;
  const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const completedEvents = timeline.filter(event => event.isCompleted).length;
  const totalEvents = timeline.length;
  const timelinePercentage = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div>
      <motion.div variants={fadeInUp}>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">Ընդհանուր առաջընթաց</div>
          <div className="text-sm font-medium">{projectProgress}%</div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${progressColor}`}
            custom={projectProgress}
            variants={progressVariants}
            initial="hidden"
            animate="visible"
          />
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
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
              initial="hidden"
              animate="visible"
            />
          </div>
        </motion.div>
        
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
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
              initial="hidden"
              animate="visible"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressBars;
