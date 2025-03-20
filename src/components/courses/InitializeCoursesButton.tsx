
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getFeaturedCourses } from './CourseDetails/featuredCourses';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const InitializeCoursesButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInitializeCourses = async () => {
    setIsLoading(true);
    try {
      const featuredCourses = getFeaturedCourses();
      
      // Check if courses with these IDs already exist
      const { data: existingCourses } = await supabase
        .from('courses')
        .select('id')
        .in('id', featuredCourses.map(course => course.id));
      
      const existingIds = new Set((existingCourses || []).map(c => c.id));
      
      // Filter out courses that already exist
      const coursesToAdd = featuredCourses.filter(course => !existingIds.has(course.id));
      
      if (coursesToAdd.length === 0) {
        toast({
          title: 'Տեղեկացում',
          description: 'Բոլոր նշված դասընթացներն արդեն ավելացված են։',
        });
        setIsLoading(false);
        return;
      }
      
      // Prepare courses for insertion
      const coursesForDb = coursesToAdd.map(course => ({
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        duration: course.duration,
        price: course.price,
        icon_name: course.icon_name,
        modules: course.modules,
        is_persistent: true, // Mark these as persistent so they can't be easily deleted
        created_by: 'admin' // Mark as created by admin
      }));
      
      // Insert courses
      const { error } = await supabase
        .from('courses')
        .insert(coursesForDb);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Հաջողությամբ ավելացված',
        description: `${coursesToAdd.length} դասընթաց հաջողությամբ ավելացվել է բազա։`,
      });
      
      // Refresh the page to show the new courses
      window.location.reload();
      
    } catch (error) {
      console.error('Error initializing courses:', error);
      toast({
        title: 'Սխալ',
        description: 'Դասընթացները չհաջողվեց ավելացնել։ Տեսեք console-ը սխալների մանրամասների համար։',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleInitializeCourses} 
      disabled={isLoading} 
      variant="outline"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Ավելացվում է...
        </>
      ) : (
        'Ավելացնել նշված դասընթացները'
      )}
    </Button>
  );
};

export default InitializeCoursesButton;
