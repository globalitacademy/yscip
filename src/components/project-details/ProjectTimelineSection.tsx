
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useProject } from '@/contexts/ProjectContext';
import { CalendarDays } from 'lucide-react';

const ProjectTimelineSection: React.FC = () => {
  const { timeline } = useProject();
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Ժամանակացույց
        </h3>
        
        <div className="space-y-4">
          {timeline && timeline.length > 0 ? (
            <div className="relative border-l border-primary/30 pl-6 ml-2 space-y-8">
              {timeline.map((event, index) => (
                <div key={index} className="relative mb-4">
                  <div className={`absolute -left-[25px] h-4 w-4 rounded-full border ${
                    event.isCompleted ? 'bg-primary border-primary' : 'bg-background border-primary/50'
                  }`}></div>
                  <div className="mb-1 text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString('hy-AM', {
                      year: 'numeric',
                      month: 'long', 
                      day: 'numeric'
                    })}
                  </div>
                  <h4 className="text-base font-medium">{event.title}</h4>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">Ժամանակացույցի տվյալներ չկան</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTimelineSection;
