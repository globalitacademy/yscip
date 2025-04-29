
import React from 'react';
import { BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStatusProps {
  projectProgress: number;
}

const ProgressStatus: React.FC<ProgressStatusProps> = ({ projectProgress }) => {
  // Ստեղծում ենք առաջխաղացման կարգավիճակը
  const getProgressStatus = () => {
    if (projectProgress >= 75) return 'Լավ առաջընթաց';
    if (projectProgress >= 50) return 'Նորմալ առաջընթաց';
    if (projectProgress >= 25) return 'Վաղ փուլում';
    return 'Նոր սկսված';
  };
  
  // Ընտրում ենք համապատասխան գույնը կարգավիճակի համար
  const getStatusColor = () => {
    if (projectProgress >= 75) return 'text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-900/30';
    if (projectProgress >= 50) return 'text-blue-600 dark:text-blue-500 bg-blue-100 dark:bg-blue-900/30';
    if (projectProgress >= 25) return 'text-amber-600 dark:text-amber-500 bg-amber-100 dark:bg-amber-900/30';
    return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50';
  };

  return (
    <div className={cn(
      "px-2 py-1 md:px-2.5 md:py-1 mt-2 md:mt-0 rounded-full",
      "text-xs font-medium flex items-center gap-1.5 transition-colors",
      "border border-transparent dark:border-opacity-20",
      getStatusColor()
    )}>
      <BarChart2 size={12} />
      {getProgressStatus()}
    </div>
  );
};

export default ProgressStatus;
