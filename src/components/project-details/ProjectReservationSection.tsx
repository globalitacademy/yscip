
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { CalendarPlus, Users } from 'lucide-react';

const ProjectReservationSection: React.FC = () => {
  const { project, isReserved } = useProject();
  
  // In a real application, this would interact with the ProjectContext
  // to reserve the project
  const handleReserveProject = () => {
    // This is a placeholder. In a real app, it would call reserveProject()
    console.log('Project reservation requested');
  };
  
  if (isReserved) return null;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center p-4 space-y-4">
          <CalendarPlus className="h-12 w-12 text-primary" />
          <h3 className="text-xl font-semibold">Ամրագրել նախագիծը</h3>
          <p className="text-muted-foreground">
            Դուք կարող եք ամրագրել այս նախագիծը՝ աշխատելու համար դրա վրա։
            Ամրագրումից հետո դուք կարող եք առաջարկել ղեկավար և սկսել աշխատանքը։
          </p>
          
          <Button 
            onClick={handleReserveProject}
            className="mt-2 w-full sm:w-auto"
          >
            <Users className="mr-2 h-4 w-4" />
            Ամրագրել նախագիծը
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectReservationSection;
