
import React from 'react';
import { SlideUp } from '@/components/LocalTransitions';

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
    <div className={`p-4 rounded-full ${colorScheme.bg} ${colorScheme.icon} mb-4 z-10`}>
      <Icon size={32} />
    </div>
    <h3 className={`text-lg font-medium mb-2 ${colorScheme.text}`}>{title}</h3>
    <p className="text-sm text-muted-foreground text-center max-w-[250px]">{description}</p>
    
    {!isLast && (
      <div 
        className={`hidden md:block absolute top-6 left-[calc(50%+40px)] w-[calc(100%-80px)] h-1 ${colorScheme.line}`} 
        style={{ transform: 'translateY(16px)' }} 
      />
    )}
  </SlideUp>
);

export default CycleStage;
