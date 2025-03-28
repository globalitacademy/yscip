
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ProfessionalCourse } from './types';
import ProfessionalCourseCard from './ProfessionalCourseCard';

const ProfessionalCoursesSection: React.FC = () => {
  const [courses, setCourses] = useState<ProfessionalCourse[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load courses from localStorage
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      try {
        const parsedCourses = JSON.parse(storedCourses);
        
        // Filter only courses that should be shown on homepage and sort by display_order
        const filteredCourses = parsedCourses
          .filter((course: ProfessionalCourse) => course.show_on_homepage)
          .sort((a: ProfessionalCourse, b: ProfessionalCourse) => 
            (a.display_order || 0) - (b.display_order || 0)
          );
          
        setCourses(filteredCourses);
      } catch (e) {
        console.error('Error parsing stored professional courses:', e);
      }
    }
  }, []);

  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Մասնագիտական դասընթացներ</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ուսումնասիրեք մեր ուսումնական ծրագրերը, որոնք ստեղծված են կարիերայի համար անհրաժեշտ հմտություններով զինելու համար
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="h-full">
              <ProfessionalCourseCard 
                course={course} 
                isAdmin={false}
                canEdit={false}
                onClick={() => navigate(`/courses/${course.slug || course.id}`)} 
              />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/courses')}
          >
            Դիտել բոլոր դասընթացները
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalCoursesSection;
