
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Course } from '@/components/courses/types';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseLoadingState from './CourseLoadingState';
import CourseErrorState from './CourseErrorState';
import CourseDetailContent from './CourseDetailContent';
import { getFeaturedCourses } from './featuredCourses';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        if (!id) return;

        // First try to fetch from Supabase by ID
        let { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        // If not found by ID, try to match by slug-like ID (lowercase title)
        if (error || !data) {
          const { data: allCourses, error: coursesError } = await supabase
            .from('courses')
            .select('*');
            
          if (coursesError) throw coursesError;
          
          // Find a course with matching ID or where the lowercase title matches the ID
          data = allCourses.find(course => 
            course.id === id || 
            course.title.toLowerCase().replace(/\s+/g, '-') === id ||
            course.title.toLowerCase() === id
          );
        }

        if (data) {
          // Map the database course to our Course type
          const mappedCourse: Course = {
            id: data.id,
            title: data.title,
            description: data.description || '',
            specialization: data.specialization || undefined,
            duration: data.duration,
            modules: data.modules || [],
            createdBy: data.created_by || 'unknown',
            color: data.color,
            button_text: data.button_text,
            icon_name: data.icon_name,
            subtitle: data.subtitle,
            price: data.price,
            image_url: data.image_url,
            institution: data.institution,
            is_persistent: data.is_persistent
          };
          
          setCourse(mappedCourse);
        } else {
          // If no matching course is found, try fallback to demo/featured courses
          const featuredCourses = getFeaturedCourses();
          
          const featuredCourse = featuredCourses.find(course => 
            course.id === id || 
            course.title.toLowerCase().includes(id || '')
          );
          
          if (featuredCourse) {
            setCourse({
              ...featuredCourse,
              createdBy: 'system',
              modules: featuredCourse.modules || [],
            });
          }
        }
      } catch (e) {
        console.error('Error fetching course:', e);
        toast.error('Չհաջողվեց բեռնել դասընթացի տվյալները');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id]);

  const handleGoBack = () => navigate(-1);

  if (loading) {
    return (
      <>
        <Header />
        <CourseLoadingState />
        <Footer />
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Header />
        <CourseErrorState 
          error="Դասընթացը չի գտնվել" 
          handleGoBack={() => navigate('/courses')} 
        />
        <Footer />
      </>
    );
  }

  const courseSlug = course.id || course.title.toLowerCase().replace(/\s+/g, '-');
  
  if (window.location.pathname.includes('/course-detail/') || window.location.pathname.includes('/course/')) {
    navigate(`/courses/${courseSlug}`, { replace: true });
    return null;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={handleGoBack} 
          className="mb-6 pl-0 hover:bg-transparent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Վերադառնալ
        </Button>

        <CourseDetailContent course={course} />
      </div>
      <Footer />
    </>
  );
};

export default CourseDetails;
