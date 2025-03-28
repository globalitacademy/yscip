
import { useCallback } from 'react';
import { toast } from 'sonner';
import { ProfessionalCourse } from '../types';
import { Book, BrainCircuit, Code, Database, FileCode, Globe } from 'lucide-react';
import React from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCourseDataLoading = (
  setProfessionalCourses: React.Dispatch<React.SetStateAction<ProfessionalCourse[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Load courses from the database
  const loadCoursesFromDatabase = useCallback(async () => {
    try {
      setLoading(true);
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*');
      
      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
        toast.error('Սխալ դասընթացների ստացման ժամանակ');
        return false;
      }
      
      if (!coursesData || coursesData.length === 0) {
        console.log('No courses found in database');
        setProfessionalCourses([]);
        toast.info('Դասընթացներ չկան, ավելացրեք նոր դասընթացներ');
        setLoading(false);
        return false;
      }
      
      const completeCourses = await Promise.all(coursesData.map(async (course) => {
        const { data: lessonsData } = await supabase
          .from('course_lessons')
          .select('*')
          .eq('course_id', course.id);
        
        const { data: requirementsData } = await supabase
          .from('course_requirements')
          .select('*')
          .eq('course_id', course.id);
        
        const { data: outcomesData } = await supabase
          .from('course_outcomes')
          .select('*')
          .eq('course_id', course.id);
        
        let iconComponent;
        switch ((course.icon_name || '').toLowerCase()) {
          case 'book':
            iconComponent = React.createElement(Book, { className: "w-16 h-16" });
            break;
          case 'code':
            iconComponent = React.createElement(Code, { className: "w-16 h-16" });
            break;
          case 'braincircuit':
          case 'brain':
            iconComponent = React.createElement(BrainCircuit, { className: "w-16 h-16" });
            break;
          case 'database':
            iconComponent = React.createElement(Database, { className: "w-16 h-16" });
            break;
          case 'filecode':
          case 'file':
            iconComponent = React.createElement(FileCode, { className: "w-16 h-16" });
            break;
          case 'globe':
            iconComponent = React.createElement(Globe, { className: "w-16 h-16" });
            break;
          default:
            iconComponent = React.createElement(Book, { className: "w-16 h-16" });
        }
        
        return {
          id: course.id,
          title: course.title,
          subtitle: course.subtitle,
          icon: iconComponent,
          iconName: course.icon_name,
          duration: course.duration,
          price: course.price,
          buttonText: course.button_text,
          color: course.color,
          createdBy: course.created_by,
          institution: course.institution,
          imageUrl: course.image_url,
          organizationLogo: course.organization_logo,
          description: course.description,
          is_public: course.is_public,
          show_on_homepage: course.show_on_homepage || false,
          display_order: course.display_order || 0,
          slug: course.slug || course.id,
          lessons: lessonsData?.map(lesson => ({
            title: lesson.title, 
            duration: lesson.duration
          })) || [],
          requirements: requirementsData?.map(req => req.requirement) || [],
          outcomes: outcomesData?.map(outcome => outcome.outcome) || []
        } as ProfessionalCourse;
      }));
      
      setProfessionalCourses(completeCourses);
      return true;
    } catch (error) {
      console.error('Error loading courses from database:', error);
      toast.error('Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setProfessionalCourses, setLoading]);

  // Sync courses with the database - just reloads from database
  const syncCoursesWithDatabase = useCallback(async () => {
    setLoading(true);
    toast.info('Դասընթացների համաժամեցում...');
    
    try {
      await loadCoursesFromDatabase();
      toast.success('Դասընթացները հաջողությամբ համաժամեցվել են');
      return true;
    } catch (error) {
      console.error('Error syncing courses with database:', error);
      toast.error('Դասընթացների համաժամեցման ժամանակ սխալ է տեղի ունեցել');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadCoursesFromDatabase, setLoading]);

  // Add a dummy function for loadCoursesFromLocalStorage to maintain compatibility
  const loadCoursesFromLocalStorage = useCallback(async () => {
    // This function now does nothing as we only want to use the database
    // It's kept for compatibility with existing code
    return true;
  }, []);

  return {
    loadCoursesFromDatabase,
    syncCoursesWithDatabase,
    loadCoursesFromLocalStorage
  };
};
