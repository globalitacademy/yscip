
import { useEffect, useState } from 'react';
import { ProfessionalCourse, isCoursePayload } from '@/components/courses/types/ProfessionalCourse';
import { getCourseById, COURSE_UPDATED_EVENT } from '@/components/courses/utils/courseUtils';
import { supabase } from '@/integrations/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { toast } from 'sonner';

/**
 * Hook for managing real-time updates from Supabase for courses
 */
export const useCourseRealtime = (courseId?: string) => {
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Load course on initial render if courseId is provided
  useEffect(() => {
    let isMounted = true;
    const loadCourse = async () => {
      if (!courseId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const fetchedCourse = await getCourseById(courseId);
        // Only update state if component is still mounted
        if (isMounted && fetchedCourse) {
          setCourse(fetchedCourse);
        }
      } catch (error) {
        console.error('Error loading course:', error);
        if (isMounted) {
          toast.error('Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCourse();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  // Set up event listener for local course updates
  useEffect(() => {
    const handleCourseUpdated = (event: CustomEvent<ProfessionalCourse>) => {
      const updatedCourse = event.detail;
      
      if (updatedCourse && (!courseId || updatedCourse.id === courseId)) {
        console.log("Course updated event received:", updatedCourse);
        setCourse(updatedCourse);
      }
    };

    window.addEventListener(COURSE_UPDATED_EVENT, handleCourseUpdated as EventListener);
    
    return () => {
      window.removeEventListener(COURSE_UPDATED_EVENT, handleCourseUpdated as EventListener);
    };
  }, [courseId]);

  // Set up Supabase real-time subscriptions
  useEffect(() => {
    if (!courseId) return;
    
    console.log('Setting up Supabase realtime subscription for course:', courseId);
    setIsSubscribed(false);
    
    const channels = [];
    
    // Main course changes channel
    const courseChannel = supabase
      .channel(`public:course:${courseId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'courses',
          filter: `id=eq.${courseId}`
        },
        async (payload: RealtimePostgresChangesPayload<{[key: string]: any}>) => {
          console.log('Course update received from Supabase:', payload);
          
          try {
            if (payload.new && isCoursePayload(payload.new)) {
              const updatedCourseId = String(payload.new.id);
              const updatedCourse = await getCourseById(updatedCourseId);
              
              if (updatedCourse) {
                console.log('Fetched updated course data:', updatedCourse);
                setCourse(updatedCourse);
                toast.info(`${updatedCourse.title} դասընթացը թարմացվել է`);
              }
            }
          } catch (error) {
            console.error('Error fetching updated course:', error);
          }
        }
      )
      .subscribe(() => {
        setIsSubscribed(true);
      });
    
    channels.push(courseChannel);

    // Lessons changes channel
    const lessonsChannel = supabase
      .channel(`public:course_lessons:${courseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'course_lessons',
          filter: `course_id=eq.${courseId}`
        },
        async (payload: RealtimePostgresChangesPayload<{[key: string]: any}>) => {
          console.log('Lessons update received from Supabase');
          
          try {
            const updatedCourse = await getCourseById(courseId);
            if (updatedCourse) {
              setCourse(updatedCourse);
              toast.info('Դասընթացի դասերը թարմացվել են');
            }
          } catch (error) {
            console.error('Error fetching updated course lessons:', error);
          }
        }
      )
      .subscribe();
    
    channels.push(lessonsChannel);

    // Requirements changes channel
    const requirementsChannel = supabase
      .channel(`public:course_requirements:${courseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'course_requirements',
          filter: `course_id=eq.${courseId}`
        },
        async (payload: RealtimePostgresChangesPayload<{[key: string]: any}>) => {
          console.log('Requirements update received from Supabase');
          
          try {
            const updatedCourse = await getCourseById(courseId);
            if (updatedCourse) {
              setCourse(updatedCourse);
              toast.info('Դասընթացի պահանջները թարմացվել են');
            }
          } catch (error) {
            console.error('Error fetching updated course requirements:', error);
          }
        }
      )
      .subscribe();
    
    channels.push(requirementsChannel);

    // Outcomes changes channel
    const outcomesChannel = supabase
      .channel(`public:course_outcomes:${courseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'course_outcomes',
          filter: `course_id=eq.${courseId}`
        },
        async (payload: RealtimePostgresChangesPayload<{[key: string]: any}>) => {
          console.log('Outcomes update received from Supabase');
          
          try {
            const updatedCourse = await getCourseById(courseId);
            if (updatedCourse) {
              setCourse(updatedCourse);
              toast.info('Դասընթացի արդյունքները թարմացվել են');
            }
          } catch (error) {
            console.error('Error fetching updated course outcomes:', error);
          }
        }
      )
      .subscribe();
    
    channels.push(outcomesChannel);
    
    // Cleanup function to properly remove all channels
    return () => {
      console.log('Cleaning up realtime subscriptions');
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
      setIsSubscribed(false);
    };
  }, [courseId]);

  return {
    course,
    setCourse,
    loading,
    isSubscribed
  };
};
