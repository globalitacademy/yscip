
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getFeaturedCourses } from '@/components/courses/CourseDetails/featuredCourses';
import { useAuth } from '@/contexts/AuthContext';

export const useInitializeFeaturedCourses = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const { user } = useAuth();

  const initializeFeaturedCourses = async () => {
    if (!user || user.role !== 'admin') {
      toast.error('Միայն ադմինիստրատորն է կարող կատարել այս գործողությունը');
      return;
    }

    setIsInitializing(true);
    try {
      const featuredCourses = getFeaturedCourses();
      
      // Check if courses already exist
      const { data: existingCourses } = await supabase
        .from('courses')
        .select('title')
        .in('title', featuredCourses.map(c => c.title));
      
      if (existingCourses && existingCourses.length > 0) {
        const existingTitles = existingCourses.map(c => c.title);
        const newCourses = featuredCourses.filter(c => !existingTitles.includes(c.title));
        
        if (newCourses.length === 0) {
          toast.info('Բոլոր կանխորոշված դասընթացներն արդեն ավելացված են');
          setIsInitializing(false);
          return;
        }
        
        // Only add courses that don't exist yet
        await addFeaturedCourses(newCourses);
        toast.success(`Ավելացվել է ${newCourses.length} կանխորոշված դասընթաց`);
      } else {
        // Add all featured courses
        await addFeaturedCourses(featuredCourses);
        toast.success('Կանխորոշված դասընթացներն ավելացված են');
      }
    } catch (error) {
      console.error('Error initializing featured courses:', error);
      toast.error('Չհաջողվեց ավելացնել կանխորոշված դասընթացները');
    } finally {
      setIsInitializing(false);
    }
  };

  const addFeaturedCourses = async (courses: any[]) => {
    // Format courses for database
    const formattedCourses = courses.map(course => ({
      title: course.title,
      description: course.description || '',
      subtitle: course.subtitle || 'ԴԱՍԸՆԹԱՑ',
      price: course.price || '58,000 ֏',
      duration: course.duration || '3 ամիս',
      icon_name: course.icon_name || 'Code',
      specialization: course.specialization || 'Ծրագրավորում',
      institution: course.institution || 'Qolej',
      modules: course.modules || [],
      button_text: 'Դիտել',
      color: 'text-amber-500',
      created_by: user?.id || 'admin',
      is_persistent: true
    }));

    // Insert courses into database
    const { error } = await supabase
      .from('courses')
      .insert(formattedCourses);
      
    if (error) throw error;
  };

  return { initializeFeaturedCourses, isInitializing };
};
