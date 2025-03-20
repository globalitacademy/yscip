
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Course } from '@/components/courses/types';
import { getFeaturedCourses } from '@/components/courses/CourseDetails/featuredCourses';

interface CoursePageContextType {
  course: Course | null;
  loading: boolean;
  enrollmentStatus: 'not_enrolled' | 'pending' | 'enrolled';
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleEnroll: () => void;
}

const CoursePageContext = createContext<CoursePageContextType | undefined>(undefined);

export const useCoursePageContext = () => {
  const context = useContext(CoursePageContext);
  if (!context) {
    throw new Error('useCoursePageContext must be used within a CoursePageProvider');
  }
  return context;
};

export const CoursePageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrollmentStatus, setEnrollmentStatus] = useState<'not_enrolled' | 'pending' | 'enrolled'>('not_enrolled');
  const [activeTab, setActiveTab] = useState('overview');

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

          // Check enrollment status if user is logged in
          if (user) {
            checkEnrollmentStatus(data.id);
          }
        } else {
          // Fallback to demo courses
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
  }, [id, user]);

  const checkEnrollmentStatus = async (courseId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('status')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setEnrollmentStatus(data.status === 'approved' ? 'enrolled' : 'pending');
      } else {
        setEnrollmentStatus('not_enrolled');
      }
    } catch (e) {
      console.error('Error checking enrollment status:', e);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Գրանցվելու համար, խնդրում ենք մուտք գործել');
      navigate('/login');
      return;
    }
    
    if (!course) return;
    
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: course.id,
          status: 'pending'
        });
      
      if (error) throw error;
      
      setEnrollmentStatus('pending');
      toast.success('Ձեր գրանցումը ընթացքի մեջ է');
    } catch (e) {
      console.error('Error enrolling in course:', e);
      toast.error('Չհաջողվեց գրանցվել դասընթացին');
    }
  };

  const value = {
    course,
    loading,
    enrollmentStatus,
    activeTab,
    setActiveTab,
    handleEnroll
  };

  return (
    <CoursePageContext.Provider value={value}>
      {children}
    </CoursePageContext.Provider>
  );
};
