
import React, { useEffect, useState } from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CourseSectionCard from '@/components/courses/CourseSectionCard';
import { Course } from '@/components/courses/types';

export const HomePageModules: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .limit(6);

        if (error) {
          console.error('Error fetching courses:', error);
          toast.error('Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել');
          return;
        }

        if (data && data.length > 0) {
          // Transform data to match Course type
          const transformedCourses = data.map(course => ({
            id: course.id,
            title: course.title,
            name: course.title,
            description: course.description || '',
            instructor: course.created_by || 'Unknown',
            specialization: course.specialization || '',
            duration: course.duration,
            modules: course.modules || [],
            prerequisites: [],
            is_public: course.is_public,
            imageUrl: course.image_url,
            createdBy: course.created_by
          }));
          
          setCourses(transformedCourses);
        }
      } catch (e) {
        console.error('Error processing courses:', e);
        toast.error('Դասընթացների մշակման ժամանակ սխալ է տեղի ունեցել');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Դասընթացների բեռնում...</p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Դասընթացներ չեն գտնվել</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <FadeIn delay="delay-100">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Դասընթացներ
          </h2>
        </FadeIn>
        
        <FadeIn delay="delay-200">
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
            Մեր առաջարկվող դասընթացները, որոնք օգնում են ձեռք բերել անհրաժեշտ հմտություններ
          </p>
        </FadeIn>

        <FadeIn delay="delay-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseSectionCard 
                key={course.id} 
                course={course} 
                onClick={() => window.location.href = `/courses/${course.id}`} 
              />
            ))}
          </div>
        </FadeIn>
        
        <FadeIn delay="delay-400">
          <div className="flex justify-center mt-8">
            <Button asChild variant="outline">
              <Link to="/courses">
                Դիտել բոլոր դասընթացները <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default HomePageModules;
