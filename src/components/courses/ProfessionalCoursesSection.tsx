
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfessionalCourse } from './types';
import ProfessionalCourseCard from './ProfessionalCourseCard';
import { supabase } from '@/integrations/supabase/client';
import { convertIconNameToComponent } from '@/utils/iconUtils';
import { toast } from 'sonner';
import { FadeIn } from '@/components/LocalTransitions';

const ProfessionalCoursesSection: React.FC = () => {
  const [courses, setCourses] = useState<ProfessionalCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchHomepageCourses = async () => {
      setLoading(true);
      try {
        // Fetch courses that should be shown on homepage
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('show_on_homepage', true)
          .order('display_order', { ascending: true })
          .limit(3); // Limit to 3 courses for homepage
        
        if (error) {
          console.error('Error fetching homepage courses:', error);
          toast.error('Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել');
          setLoading(false);
          return;
        }
        
        if (!data || data.length === 0) {
          setLoading(false);
          return;
        }
        
        // Process each course to include its icon
        const processedCourses = data.map(course => {
          // Create icon component
          const iconElement = convertIconNameToComponent(course.icon_name);
          
          return {
            id: course.id,
            title: course.title,
            subtitle: course.subtitle,
            icon: iconElement,
            iconName: course.icon_name,
            duration: course.duration,
            price: course.price,
            buttonText: course.button_text || "Մանրամասն",
            color: course.color,
            createdBy: course.created_by || "",
            institution: course.institution || "",
            imageUrl: course.image_url,
            organizationLogo: course.organization_logo,
            description: course.description,
            show_on_homepage: course.show_on_homepage || false,
            display_order: course.display_order || 0,
            slug: course.slug || course.id // Use slug if available, otherwise fall back to ID
          } as ProfessionalCourse;
        });
        
        setCourses(processedCourses);
      } catch (e) {
        console.error('Error processing homepage courses:', e);
        toast.error('Դասընթացների մշակման ժամանակ սխալ է տեղի ունեցել');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomepageCourses();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Դասընթացների բեռնում...</p>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <FadeIn delay="delay-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Մասնագիտական դասընթացներ</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ուսումնասիրեք մեր ուսումնական ծրագրերը, որոնք ստեղծված են կարիերայի համար անհրաժեշտ հմտություններով զինելու համար
            </p>
          </div>
        </FadeIn>

        <FadeIn delay="delay-200">
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
        </FadeIn>
        
        <FadeIn delay="delay-300">
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/courses')}
            >
              Դիտել բոլոր դասընթացները <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default ProfessionalCoursesSection;
