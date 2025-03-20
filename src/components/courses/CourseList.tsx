
import React from 'react';
import { Course } from './types';
import CourseCard from './CourseCard';
import { useAuth } from '@/contexts/AuthContext';

interface CourseListProps {
  courses: Course[];
  userCourses?: Course[];
  isAdmin?: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (id: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({ 
  courses, 
  userCourses,
  isAdmin = false, 
  onEdit, 
  onDelete 
}) => {
  const { user } = useAuth();
  
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">Դասընթացներ չեն գտնվել</h3>
        <p className="text-muted-foreground">Այս պահին դասընթացներ չկան</p>
      </div>
    );
  }

  const displayCourses = courses.map(course => {
    // Check if user can edit this course (admin or course creator)
    const canEdit = isAdmin && (user?.role === 'admin' || course.createdBy === user?.id);
    
    // Generate a URL-friendly slug from the title if needed
    const courseSlug = course.id || course.title.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <CourseCard
        key={course.id}
        course={course}
        isAdmin={isAdmin}
        canEdit={canEdit}
        onEdit={onEdit}
        onDelete={onDelete}
        detailUrl={`/courses/${courseSlug}`}
      />
    );
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayCourses}
    </div>
  );
};

export default CourseList;
