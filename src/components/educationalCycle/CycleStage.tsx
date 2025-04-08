
import React from 'react';
import { SlideUp } from '@/components/LocalTransitions';
import { cn } from '@/lib/utils';

// Extract color scheme type for reuse
export type StageColorScheme = {
  bg: string;
  text: string;
  icon: string;
  line: string;
};

interface CycleStageProps {
  icon: React.ElementType;
  title: string;
  description: string;
  colorScheme: StageColorScheme;
  delay: string;
  isLast?: boolean;
}

const CycleStage: React.FC<CycleStageProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  colorScheme,
  delay,
  isLast = false
}) => (
  <SlideUp delay={delay} className="flex flex-col items-center relative">
    <div 
      className={cn(
        'p-3 md:p-4 rounded-full', 
        colorScheme.bg, 
        colorScheme.icon, 
        'mb-3 md:mb-4 z-10 shadow-sm',
        'dark:shadow-gray-900/30'
      )}
      aria-hidden="true"
    >
      <Icon size={28} />
    </div>
    <h3 className={cn('text-base md:text-lg font-medium mb-2', colorScheme.text)}>
      {title}
    </h3>
    <p className="text-sm text-muted-foreground text-center max-w-[250px] px-2">
      {description}
    </p>
    
    {!isLast && (
      <div 
        className={cn(
          'hidden md:block absolute top-6 left-[calc(50%+40px)]',
          'w-[calc(100%-80px)] h-1',
          colorScheme.line
        )} 
        style={{ transform: 'translateY(16px)' }}
        aria-hidden="true"
      />
    )}
  </SlideUp>
);

export default CycleStage;
