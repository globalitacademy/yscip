
import React from 'react';
import { EducationalModule } from './types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ModuleLearningProps {
  module: EducationalModule;
}

const ModuleLearning: React.FC<ModuleLearningProps> = ({ module }) => {
  const { title, description, topics, status, progress = 0 } = module;
  const Icon = module.icon;

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
  
  // Calculate estimated time to complete (very rough estimate)
  const estimatedTime = topics ? Math.ceil(topics.length * 1.5) : 10; // 1.5 hours per topic as a rough estimate
  
  return (
    <div className="space-y-8">
      {/* Module Overview */}
      <Card className={`border ${styles.accent}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={cn("p-3 rounded-full", styles.bg, styles.icon)}>
                {Icon && <Icon size={24} />}
              </div>
              <CardTitle>{title}</CardTitle>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>~{estimatedTime} ժամ</span>
            </div>
          </div>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Առաջընթաց</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button>Սկսել ուսուցումը</Button>
              <Button variant="outline">Թեստավորում</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Module Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Ուսումնական նյութեր</CardTitle>
          <CardDescription>
            Այս մոդուլը բաղկացած է {topics?.length || 0} թեմաներից՝ տեսական և գործնական նյութերով
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {topics?.map((topic, index) => (
              <div 
                key={index}
                className={cn(
                  "p-4 border rounded-lg flex items-start gap-3 transition-all",
                  "hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                )}
              >
                <div className="mt-0.5 text-primary">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Թեմա {index + 1}</h3>
                  <p className="text-muted-foreground">{topic}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleLearning;
