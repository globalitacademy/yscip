
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
        <FadeIn>
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Ծրագրավորման դասընթացներ</h2>
            <p className="text-lg text-muted-foreground mb-4">Ծրագրավորման դասընթացներ նախատեսված սկսնակների համար</p>
            <div className="w-20 h-1 bg-amber-500 rounded-full"></div>
          </div>
        </FadeIn>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {professionalCourses.slice(0, 4).map((course) => (
            <ProfessionalCourseCard key={course.id} course={course} />
          ))}
        </div>

        {professionalCourses.length > 4 && (
          <div className="flex justify-center mt-12">
            <Button asChild variant="outline" className="px-6 py-2 rounded-full hover:bg-primary/10">
              <Link to="/courses">
                Դիտել բոլոր դասընթացները
              </Link>
            </Button>
          </div>
        )}
        
        {canManageCourses && (
          <div className="mt-8 flex justify-end">
            <Button variant="outline" onClick={handleAddCourse}>
              Ավելացնել դասընթաց
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfessionalCoursesSection;
