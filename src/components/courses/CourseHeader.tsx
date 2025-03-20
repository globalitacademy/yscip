
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CourseHeaderProps {
  canAddCourses: boolean;
  onAddCourse: () => void;
  onInitializeCourses?: () => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ 
  canAddCourses, 
  onAddCourse,
  onInitializeCourses
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Դասընթացներ</h1>
        <p className="text-muted-foreground">
          Դասընթացների կառավարում և մշտադիտարկում
        </p>
      </div>
      <div className="flex gap-2">
        {isAdmin && onInitializeCourses && (
          <Button variant="outline" onClick={onInitializeCourses}>
            Ավելացնել կանխորոշված դասընթացները
          </Button>
        )}
        {canAddCourses && (
          <Button onClick={onAddCourse}>
            <Plus className="mr-2 h-4 w-4" />
            Ավելացնել դասընթաց
          </Button>
        )}
      </div>
    </div>
  );
};

export default CourseHeader;
