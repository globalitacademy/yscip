
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseManagement } from './useCourseManagement';
import { Course } from './types';
import { toast } from 'sonner';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { defaultProfessionalCourses } from './data/defaultCourses';
import { transformCoursesToProfessional } from './utils/courseTransformer';
import ProfessionalCourseCard from './ProfessionalCourseCard';
import CoursesSectionHeader from './CoursesSectionHeader';
import { FadeIn } from '@/components/LocalTransitions';

const ProfessionalCoursesSection: React.FC = () => {
  const { user } = useAuth();
  const { courses } = useCourseManagement();
  const [professionalCourses, setProfessionalCourses] = useState<ProfessionalCourse[]>(defaultProfessionalCourses);
  const navigate = useNavigate();

  // Check if user has permissions to add courses
  const isAdmin = user?.role === 'admin';
  const isLecturer = ['lecturer', 'instructor', 'supervisor', 'project_manager'].includes(user?.role || '');
  const isEmployer = user?.role === 'employer';
  const canManageCourses = isAdmin || isLecturer || isEmployer;

  // Transform courses from database to ProfessionalCourse format
  useEffect(() => {
    if (courses && courses.length > 0) {
      const transformedCourses = transformCoursesToProfessional(courses);
      setProfessionalCourses(transformedCourses);
    }
  }, [courses]);

  const handleAddCourse = () => {
    if (!user) {
      toast.error('Խնդրում ենք մուտք գործել համակարգ նախքան դասընթաց ավելացնելը');
      return;
    }
    
    navigate('/courses');
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <CoursesSectionHeader
          title="Ծրագրավորման դասընթացներ"
          subtitle="Ծրագրավորման դասընթացներ նախատեսված սկսնակների համար"
          canManageCourses={canManageCourses}
          onAddCourse={handleAddCourse}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionalCourses.map((course) => (
            <ProfessionalCourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button asChild variant="outline">
            <Link to="/courses">
              Դիտել բոլոր դասընթացները
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalCoursesSection;
