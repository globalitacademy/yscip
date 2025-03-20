
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import InitializeCoursesButton from './InitializeCoursesButton';

interface CourseHeaderProps {
  canAddCourses: boolean;
  onAddCourse?: () => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ 
  canAddCourses,
  onAddCourse 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Դասընթացներ</h1>
        <p className="text-muted-foreground">
          Կառավարեք ձեր դասընթացները, ստեղծեք նոր դասընթացներ և հետևեք առաջընթացին
        </p>
      </div>
      
      <div className="flex gap-3 self-end sm:self-center">
        <InitializeCoursesButton />
        
        {canAddCourses && (
          <Button onClick={onAddCourse}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ավելացնել դասընթաց
          </Button>
        )}
      </div>
    </div>
  );
};

export default CourseHeader;
