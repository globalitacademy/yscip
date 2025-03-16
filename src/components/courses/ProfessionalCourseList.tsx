
import React from 'react';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import ProfessionalCourseCard from './ProfessionalCourseCard';
import { Skeleton } from "@/components/ui/skeleton";

interface ProfessionalCourseListProps {
  courses: ProfessionalCourse[];
  userCourses: ProfessionalCourse[];
  isAdmin: boolean;
  onEdit: (course: ProfessionalCourse) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const ProfessionalCourseList: React.FC<ProfessionalCourseListProps> = ({
  courses,
  userCourses,
  isAdmin,
  onEdit,
  onDelete,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center p-6 bg-muted/50 rounded-lg">
        <h3 className="text-xl font-medium">Դասընթացներ չկան</h3>
        <p className="text-muted-foreground mt-2">
          Այս պահին դասընթացներ չկան։ Նոր դասընթաց ավելացնելու համար օգտագործեք "Ավելացնել նոր դասընթաց" կոճակը։
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <ProfessionalCourseCard
          key={course.id}
          course={course}
          isAdmin={isAdmin}
          onEdit={() => onEdit(course)}
          onDelete={() => onDelete(course.id)}
        />
      ))}
    </div>
  );
};

export default ProfessionalCourseList;
