
import React from 'react';
import { Course } from './types/index';
import { ProfessionalCourse } from './types/index';
import CourseCard from './CourseCard';
import ProfessionalCourseCard from './ProfessionalCourseCard';
import { FadeIn } from '@/components/LocalTransitions';
import { useCourseContext } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';

interface CourseListProps {
  courses: Course[];
  professionalCourses: ProfessionalCourse[];
}

const CourseList: React.FC<CourseListProps> = ({ courses, professionalCourses }) => {
  const { handleEditInit, handleDeleteCourse } = useCourseContext();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  // Safety check for empty arrays
  if ((!courses || courses.length === 0) && (!professionalCourses || professionalCourses.length === 0)) {
    return (
      <div className="text-center p-10 bg-muted rounded-lg">
        <p className="text-muted-foreground">Դասընթացներ չկան</p>
      </div>
    );
  }

  return (
    <FadeIn className="space-y-8">
      {professionalCourses && professionalCourses.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Մասնագիտական դասընթացներ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionalCourses.map((course) => (
              <ProfessionalCourseCard
                key={course.id} 
                course={course} 
                isAdmin={isAdmin}
                canEdit={isAdmin || course.createdBy === user?.name}
                onEdit={() => handleEditInit(course, 'professional')}
                onDelete={handleDeleteCourse} 
              />
            ))}
          </div>
        </div>
      )}
      
      {courses && courses.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Ստանդարտ դասընթացներ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isAdmin={isAdmin}
                canEdit={isAdmin || course.createdBy === user?.id}
                onEdit={() => handleEditInit(course, 'standard')}
                onDelete={handleDeleteCourse} 
              />
            ))}
          </div>
        </div>
      )}
    </FadeIn>
  );
};

export default CourseList;
