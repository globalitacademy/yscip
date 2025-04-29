
import React from 'react';
import { CheckCircle, Clock, CircleDashed } from 'lucide-react';
import { motion } from 'framer-motion';
import { Task } from '@/data/projectThemes';
import { calculateTaskDistribution } from './progressUtils';

interface TaskDistributionProps {
  tasks: Task[];
}

const TaskDistribution: React.FC<TaskDistributionProps> = ({ tasks }) => {
  const { todo, inProgress, completed } = calculateTaskDistribution(tasks);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0 }
  };
  
  if (tasks.length === 0) {
    return (
      <div className="mt-4 p-3 bg-muted/40 rounded-lg text-center text-muted-foreground text-sm">
        Նախագծի քայլերը դեռ սահմանված չեն
      </div>
    );
  }

  return (
    <div className="mt-4 md:mt-6">
      <h4 className="text-sm font-medium mb-3">Քայլերի վիճակագրություն</h4>
      
      <motion.div 
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CircleDashed size={16} className="text-gray-500" />
            <span className="text-sm">Սպասվող</span>
          </div>
          <span className="text-sm font-medium">{todo}%</span>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-amber-500" />
            <span className="text-sm">Ընթացքում</span>
          </div>
          <span className="text-sm font-medium">{inProgress}%</span>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-sm">Ավարտված</span>
          </div>
          <span className="text-sm font-medium">{completed}%</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TaskDistribution;
