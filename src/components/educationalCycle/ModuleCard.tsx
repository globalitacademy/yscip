
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { EducationalModule } from './types';
import { Progress } from '@/components/ui/progress';

interface ModuleCardProps {
  module: EducationalModule;
  delay: string;
  showProgress?: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, delay, showProgress = false }) => {
  const { title, icon: Icon, description, status = 'not-started', progress = 0 } = module;
  
  // Status based styling
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return {
          border: 'border-green-500 dark:border-green-600',
          bg: 'bg-green-50 dark:bg-green-900/20',
          icon: 'text-green-600 dark:text-green-400'
        };
      case 'in-progress':
        return {
          border: 'border-blue-500 dark:border-blue-600',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          icon: 'text-blue-600 dark:text-blue-400'
        };
      default:
        return {
          border: 'border-gray-200 dark:border-gray-700',
          bg: 'bg-white dark:bg-gray-800',
          icon: 'text-gray-600 dark:text-gray-400'
        };
    }
  };
  
  const styles = getStatusStyles();
  
  return (
    <FadeIn delay={delay}>
      <div className={`rounded-lg p-5 ${styles.bg} border ${styles.border} transition-all duration-300 h-full flex flex-col`}>
        <div className="flex items-center mb-3">
          {Icon && (
            <div className={`mr-3 ${styles.icon}`}>
              <Icon size={20} />
            </div>
          )}
          <h3 className="font-medium text-foreground">{title}</h3>
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
        )}
        
        {showProgress && (
          <div className="mt-auto pt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{status === 'not-started' ? 'Չսկսված' : status === 'in-progress' ? 'Ընթացքի մեջ' : 'Ավարտված'}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </div>
    </FadeIn>
  );
};

export default ModuleCard;
