
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CoursesSectionHeaderProps {
  title: string;
  subtitle: string;
  canManageCourses: boolean;
  onAddCourse: () => void;
}

const CoursesSectionHeader: React.FC<CoursesSectionHeaderProps> = ({
  title,
  subtitle,
  canManageCourses,
  onAddCourse
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <FadeIn>
          <h2 className="text-3xl font-bold mb-2">
            {title}
          </h2>
        </FadeIn>
        
        <FadeIn delay="delay-100">
          <p className="text-muted-foreground max-w-2xl mb-2">
            {subtitle}
          </p>
        </FadeIn>
      </div>
      
      {canManageCourses && (
        <FadeIn delay="delay-150">
          <Button 
            onClick={onAddCourse}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Ավելացնել դասընթաց
          </Button>
        </FadeIn>
      )}
    </div>
  );
};

export default CoursesSectionHeader;
