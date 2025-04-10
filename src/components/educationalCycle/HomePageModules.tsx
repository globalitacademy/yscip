
import React, { useEffect, useState } from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProfessionalCourse } from '@/components/courses/types';
import ProfessionalCourseCard from '@/components/courses/ProfessionalCourseCard';
import { convertIconNameToComponent } from '@/utils/iconUtils';
import { useTheme } from '@/hooks/use-theme';

export const HomePageModules: React.FC = () => {
  const [courses, setCourses] = useState<ProfessionalCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_public', true) // Only show public courses from database
          .limit(6);

        if (error) {
          console.error('Error fetching courses:', error);
          toast.error('Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել');
          return;
        }

        if (data && data.length > 0) {
          // Transform data to match ProfessionalCourse type
          const transformedCourses = data.map(course => {
            // Create icon component
            const iconElement = convertIconNameToComponent(course.icon_name);
            
            return {
              id: course.id,
              title: course.title,
              subtitle: course.subtitle || 'ԴԱՍԸՆԹԱՑ',
              icon: iconElement,
              iconName: course.icon_name,
              duration: course.duration,
              price: course.price,
              buttonText: course.button_text || "Մանրամասն",
              color: course.color,
              createdBy: course.created_by || "Unknown",
              institution: course.institution || "",
              imageUrl: course.image_url,
              organizationLogo: course.organization_logo,
              description: course.description,
              is_public: course.is_public,
              slug: course.slug || course.id
            } as ProfessionalCourse;
          });
          
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

  const getSectionClass = () => {
    return theme === 'dark' 
      ? "py-16 bg-gray-900/40" 
      : "py-16 bg-gray-50";
  };

  if (loading) {
    return (
      <div className={getSectionClass()}>
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 dark:text-gray-300" />
          <p className="dark:text-gray-300">Դասընթացների բեռնում...</p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className={getSectionClass()}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground dark:text-gray-400">Դասընթացներ չեն գտնվել</p>
        </div>
      </div>
    );
  }

  return (
    <div className={getSectionClass()}>
      <div className="container mx-auto px-4">
        <FadeIn delay="delay-100">
          <h2 className="text-3xl font-bold mb-4 text-center dark:text-gray-100">
            Մասնագիտական դասընթացներ
          </h2>
        </FadeIn>
        
        <FadeIn delay="delay-200">
          <p className="text-muted-foreground dark:text-gray-300 text-center max-w-2xl mx-auto mb-8">
            Մեր առաջարկվող դասընթացները, որոնք օգնում են ձեռք բերել մասնագիտական հմտություններ
          </p>
        </FadeIn>

        <FadeIn delay="delay-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <ProfessionalCourseCard 
                key={course.id} 
                course={course} 
                isAdmin={false}
                canEdit={false}
              />
            ))}
          </div>
        </FadeIn>
        
        <FadeIn delay="delay-400">
          <div className="flex justify-center mt-8">
            <Button asChild variant="outline" className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700">
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
