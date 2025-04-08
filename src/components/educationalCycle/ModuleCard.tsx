
import React, { useState, useRef } from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { EducationalModule } from './types';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModuleCardProps {
  module: EducationalModule;
  delay: string;
  showProgress?: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, delay, showProgress = false }) => {
  const { title, icon: Icon, description, status = 'not-started', progress = 0, topics = [] } = module;
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Status based styling
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return {
          accent: 'border-green-500 dark:border-green-600',
          bg: 'bg-green-50 dark:bg-green-900/20',
          icon: 'text-green-600 dark:text-green-400'
        };
      case 'in-progress':
        return {
          accent: 'border-blue-500 dark:border-blue-600',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          icon: 'text-blue-600 dark:text-blue-400'
        };
      default:
        return {
          accent: 'border-gray-200 dark:border-gray-700',
          bg: 'bg-white dark:bg-gray-800',
          icon: 'text-gray-600 dark:text-gray-400'
        };
    }
  };
  
  const styles = getStatusStyles();

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  // Handle keyboard accessibility
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFlip();
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'not-started': return 'Չսկսված';
      case 'in-progress': return 'Ընթացքի մեջ';
      case 'completed': return 'Ավարտված';
      default: return status;
    }
  };

  const visibleTopics = topics?.length > 8 ? topics.slice(0, 8) : topics;
  
  return (
    <FadeIn delay={delay}>
      <div 
        ref={cardRef}
        className={cn(
          'flip-card h-full',
          isFlipped ? 'flipped' : ''
        )}
        aria-expanded={isFlipped}
      >
        <div className="flip-card-inner h-full w-full relative">
          {/* Front of the card */}
          <div className="flip-card-front absolute w-full h-full">
            <Card className={`card-hover border ${styles.accent} transition-all h-full shadow-sm hover:shadow-md dark:shadow-gray-900/30`}>
              <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                <div className="flex items-center mb-3">
                  {Icon && (
                    <div className={`mr-3 ${styles.icon}`} aria-hidden="true">
                      <Icon size={20} />
                    </div>
                  )}
                  <h3 className="font-medium text-foreground line-clamp-2">{title}</h3>
                </div>
                
                {description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{description}</p>
                )}
                
                {showProgress && (
                  <div className="mt-auto pt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{getStatusText()}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress 
                      value={progress} 
                      className="h-1.5" 
                      aria-label={`${progress}% completed`}
                    />
                  </div>
                )}

                {topics && topics.length > 0 && (
                  <div className="mt-auto pt-2 flex justify-center">
                    <button 
                      onClick={handleFlip} 
                      onKeyDown={handleKeyDown}
                      className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      aria-label={`Show topics for ${title}`}
                    >
                      <span className="mr-1">Տեսնել թեմաները</span>
                      <ChevronDown className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Back of the card */}
          <div className="flip-card-back absolute w-full h-full">
            <Card className={`border ${styles.accent} h-full overflow-hidden shadow-sm dark:shadow-gray-900/30`}>
              <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-foreground line-clamp-1">{title} - Թեմաներ</h3>
                  <button 
                    onClick={handleFlip}
                    onKeyDown={handleKeyDown}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    aria-label="Back to module information"
                  >
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="overflow-y-auto flex-grow pr-2 -mr-2">
                  {visibleTopics && visibleTopics.length > 0 ? (
                    <ul className="text-sm space-y-1.5" aria-label="Module topics">
                      {visibleTopics.map((topic, index) => (
                        <li key={index} className="text-muted-foreground">
                          • {topic}
                        </li>
                      ))}
                      {topics.length > 8 && (
                        <li className="text-muted-foreground font-medium pt-1">
                          ... և ևս {topics.length - 8} թեմաներ
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Թեմաների ցանկը դատարկ է</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default ModuleCard;
