
import React from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface DaysRemainingProps {
  daysRemaining: number | null;
}

const DaysRemaining: React.FC<DaysRemainingProps> = ({ daysRemaining }) => {
  const isMobile = useIsMobile();
  
  if (daysRemaining === null) {
    return null;
  }
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="bg-blue-50 dark:bg-blue-900/30 p-3 md:p-4 rounded-lg flex flex-col md:flex-row md:items-center md:gap-4 border border-blue-100 dark:border-blue-900"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.3 }}
    >
      <div className="p-2 md:p-2.5 rounded-full bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-200 mx-auto md:mx-0 mb-2 md:mb-0">
        <Clock size={isMobile ? 18 : 20} />
      </div>
      <div className="text-center md:text-left">
        <h4 className="text-xs md:text-sm font-medium text-blue-800 dark:text-blue-300">Մոտավոր մնացած ժամանակ</h4>
        <p className="text-lg md:text-xl font-bold text-blue-900 dark:text-blue-200">{daysRemaining} օր</p>
      </div>
    </motion.div>
  );
};

export default DaysRemaining;
