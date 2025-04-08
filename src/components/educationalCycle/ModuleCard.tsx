
import React, { useState, useRef } from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { EducationalModule } from './types';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ModuleCardProps {
  module: EducationalModule;
  delay: string;
  showProgress?: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, delay, showProgress = false }) => {
  const { id, title, icon: Icon, description, status = 'not-started', progress = 0, topics = [] } = module;
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Status based styling
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return {
          accent: 'border-green-500 dark:border-green-400',
          bg: 'bg-green-50 dark:bg-green-900/30',
          icon: 'text-green-600 dark:text-green-400'
        };
      case 'in-progress':
        return {
          accent: 'border-blue-500 dark:border-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-900/30',
          icon: 'text-blue-600 dark:text-blue-400'
        };
      default:
        return {
          accent: 'border-gray-200 dark:border-gray-600',
          bg: 'bg-white dark:bg-gray-800/80',
          icon: 'text-gray-600 dark:text-gray-300'
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

  const visibleTopics = topics?.length > 6 ? topics.slice(0, 6) : topics;
  
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
            <Card className={`card-hover border ${styles.accent} transition-all h-full shadow-sm hover:shadow-md dark:shadow-gray-800/50`}>
              <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                <div className="flex items-start gap-3 mb-4">
                  {Icon && (
                    <div className={`mt-1 ${styles.icon}`} aria-hidden="true">
                      <Icon size={20} />
                    </div>
                  )}
                  <h3 className="font-medium text-foreground dark:text-gray-100 line-clamp-2">{title}</h3>
                </div>
                
                {description && (
                  <p className="text-sm text-muted-foreground dark:text-gray-300 mb-6 line-clamp-3">{description}</p>
                )}
                
                <div className="mt-auto space-y-5">
                  {showProgress && (
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground dark:text-gray-300 mb-2">
                        <span>{getStatusText()}</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress 
                        value={progress} 
                        className="h-1.5 dark:bg-gray-700" 
                        aria-label={`${progress}% completed`}
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-xs flex gap-1.5 items-center dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-200"
                    >
                      <Link to={`/module/${id}`}>
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Սովորել</span>
                      </Link>
                    </Button>
                    
                    {topics && topics.length > 0 && (
                      <button 
                        onClick={handleFlip} 
                        onKeyDown={handleKeyDown}
                        className="flex items-center text-xs text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                        aria-label={`Show topics for ${title}`}
                      >
                        <span className="mr-1">Թեմաներ</span>
                        <ChevronDown className="h-3 w-3" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back of the card */}
          <div className="flip-card-back absolute w-full h-full">
            <Card className={`border ${styles.accent} h-full overflow-hidden shadow-sm dark:shadow-gray-800/50`}>
              <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-foreground dark:text-gray-100 line-clamp-1">{title} - Թեմաներ</h3>
                  <button 
                    onClick={handleFlip}
                    onKeyDown={handleKeyDown}
                    className="text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    aria-label="Back to module information"
                  >
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="overflow-y-auto flex-grow pr-2 -mr-2 mb-4">
                  {visibleTopics && visibleTopics.length > 0 ? (
                    <ul className="text-sm space-y-2.5" aria-label="Module topics">
                      {visibleTopics.map((topic, index) => (
                        <li key={index} className="text-muted-foreground dark:text-gray-300">
                          • {topic}
                        </li>
                      ))}
                      {topics.length > 6 && (
                        <li className="text-muted-foreground dark:text-gray-300 font-medium pt-2">
                          ... և ևս {topics.length - 6} թեմաներ
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground dark:text-gray-300">Թեմաների ցանկը դատարկ է</p>
                  )}
                </div>
                
                <div className="mt-auto pt-3 border-t dark:border-gray-700">
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="w-full text-xs dark:bg-blue-700 dark:hover:bg-blue-600 dark:text-white"
                  >
                    <Link to={`/module/${id}`}>
                      Անցնել դեպի ամբողջական թեմաներ
                    </Link>
                  </Button>
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
