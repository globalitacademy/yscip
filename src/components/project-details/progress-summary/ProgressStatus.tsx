
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

  return (
    <div className="px-2 py-1 md:px-2.5 md:py-1 mt-2 md:mt-0 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1.5">
      <BarChart2 size={12} />
      {getProgressStatus()}
    </div>
  );
};

export default ProgressStatus;
