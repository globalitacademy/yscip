
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Course } from './types';
import CourseSectionCard from './CourseSectionCard';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const CoursesSection: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .limit(6);

        if (error) {
          throw error;
        }

        // Map the database courses to our Course type
        const mappedCourses: Course[] = data.map((course) => ({
          id: course.id,
          title: course.title,
          description: course.description || '',
          specialization: undefined, // This field doesn't exist in DB
          duration: course.duration,
          modules: [], // This field doesn't exist in DB
          createdBy: course.created_by || 'unknown',
          color: course.color,
          button_text: course.button_text,
          icon_name: course.icon_name,
          subtitle: course.subtitle,
          price: course.price,
          image_url: course.image_url,
          institution: course.institution,
          is_persistent: course.is_persistent
        }));

        setCourses(mappedCourses);
      } catch (e) {
        console.error('Error fetching courses:', e);
        
        // Fallback to localStorage if Supabase fails
        const storedCourses = localStorage.getItem('courses');
        if (storedCourses) {
          try {
            setCourses(JSON.parse(storedCourses));
          } catch (error) {
            console.error('Error parsing stored courses:', error);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-full max-w-2xl mx-auto mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Մեր կուրսերը</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ուսումնասիրեք մեր կրթական մոդուլները, որոնք նախագծված են ձեր մասնագիտական հմտությունները զարգացնելու համար
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseSectionCard key={course.id} course={course} onClick={() => navigate('/courses')} />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/courses')}
          >
            Դիտել բոլոր կուրսերը
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
