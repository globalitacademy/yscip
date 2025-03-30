
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Course } from './types';
import CourseSectionCard from './CourseSectionCard';
import { FadeIn } from '@/components/LocalTransitions';
import { toast } from 'sonner';

const CoursesSection: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Load courses from localStorage
        const storedCourses = localStorage.getItem('courses');
        if (storedCourses) {
          const parsedCourses = JSON.parse(storedCourses);
          // Get only the first 3 courses for the homepage
          const featuredCourses = parsedCourses.slice(0, 3);
          setCourses(featuredCourses);
        }
      } catch (e) {
        console.error('Error parsing stored courses:', e);
        toast.error('Սխալ տեղի ունեցավ դասընթացները բեռնելիս');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6 mx-auto animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8 mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(item => (
              <div key={item} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
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
        <FadeIn delay="delay-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Մեր կուրսերը</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ուսումնասիրեք մեր կրթական մոդուլները, որոնք նախագծված են ձեր մասնագիտական հմտությունները զարգացնելու համար
            </p>
          </div>
        </FadeIn>

        <FadeIn delay="delay-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseSectionCard key={course.id} course={course} onClick={() => navigate(`/courses/${course.id}`)} />
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
              Դիտել բոլոր կուրսերը <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CoursesSection;
