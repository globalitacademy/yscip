
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

// Import sub-components
import ProgressBars from './progress-summary/ProgressBars';
import DaysRemaining from './progress-summary/DaysRemaining';
import TaskDistribution from './progress-summary/TaskDistribution';
import ProgressStatus from './progress-summary/ProgressStatus';
import { getProgressColor, calculateDaysRemaining } from './progress-summary/progressUtils';

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
  const isMobile = useIsMobile();
  
  if (!project) return null;
  
  const progressColor = getProgressColor(projectProgress);
  const daysRemaining = calculateDaysRemaining(project, projectProgress);
  
  return (
    <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
      <CardHeader className="flex items-start flex-col md:flex-row md:items-center md:justify-between p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl flex items-center gap-2 text-primary dark:text-primary-foreground">
          <TrendingUp size={isMobile ? 18 : 20} /> Առաջընթացի ամփոփում
        </CardTitle>
        <ProgressStatus projectProgress={projectProgress} />
      </CardHeader>
      
      <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <ProgressBars 
            tasks={tasks} 
            timeline={timeline} 
            projectProgress={projectProgress}
            progressColor={progressColor}
          />
          
          <DaysRemaining daysRemaining={daysRemaining} />
          
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <TaskDistribution tasks={tasks} />
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ProjectProgressSummary;
