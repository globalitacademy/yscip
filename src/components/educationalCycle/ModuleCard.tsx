
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CircleCheck, Clock, CircleX } from 'lucide-react';
import type { EducationalModule } from './types';

interface ModuleCardProps {
  module: EducationalModule;
  delay?: string;
  showProgress?: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, delay = '', showProgress = false }) => {
  const Icon = module.icon;
  
  const getStatusIcon = () => {
    switch (module.status) {
      case 'completed':
        return <CircleCheck className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'not-started':
      default:
        return <CircleX className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = () => {
    switch (module.status) {
      case 'completed':
        return 'Ավարտված է';
      case 'in-progress':
        return 'Ընթացքի մեջ է';
      case 'not-started':
      default:
        return 'Չսկսված';
    }
  };

  return (
    <FadeIn delay={delay}>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Icon className="h-6 w-6 text-primary" />
            {showProgress && (
              <div className="flex items-center gap-2 text-sm">
                {getStatusIcon()}
                <span className="text-xs">{getStatusLabel()}</span>
              </div>
            )}
          </div>
          <CardTitle className="text-lg">{module.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-grow">
          {module.description && (
            <p className="text-muted-foreground text-sm mb-3">{module.description}</p>
          )}
          
          {module.topics && module.topics.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium mb-2">Թեմաներ</h4>
              <div className="flex flex-wrap gap-1.5">
                {module.topics.map((topic, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        {showProgress && (
          <CardFooter className="pt-0">
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1">
                <span>Առաջընթաց</span>
                <span>{module.progress || 0}%</span>
              </div>
              <Progress value={module.progress || 0} className="h-1.5" />
            </div>
          </CardFooter>
        )}
      </Card>
    </FadeIn>
  );
};

export default ModuleCard;
