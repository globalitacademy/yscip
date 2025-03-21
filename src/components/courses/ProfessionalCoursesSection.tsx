
import React, { useState, useEffect } from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { Button } from '@/components/ui/button';
import { Book, BrainCircuit, Code, Database, FileCode, Globe, User, Building, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import EditProfessionalCourseDialog from './EditProfessionalCourseDialog';
import { useAuth } from '@/contexts/AuthContext';
import { 
  saveCourseChanges, 
  COURSE_UPDATED_EVENT,
  getAllCourses, 
  getCourseById,
  createCourseDeepCopy,
  convertIconNameToComponent
} from './utils/courseUtils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import ProfessionalCourseCard from './ProfessionalCourseCard';

const initialProfessionalCourses: ProfessionalCourse[] = [
  {
    id: '1',
    title: 'WEB Front-End',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: null,
    iconName: 'code',
    duration: '9 ամիս',
    price: '58,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-amber-500',
    createdBy: 'Արամ Հակոբյան',
    institution: 'ՀՊՏՀ',
    preferIcon: false,
    imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    organizationLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/ASUE-Logo.png/220px-ASUE-Logo.png'
  },
  {
    id: '2',
    title: 'Python (ML / AI)',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: null,
    iconName: 'ai',
    duration: '7 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-blue-500',
    createdBy: 'Լիլիթ Մարտիրոսյան',
    institution: 'ԵՊՀ',
    preferIcon: false,
    imageUrl: 'https://images.unsplash.com/photo-1526379879527-8559ecfd8bf7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: '3',
    title: 'Java',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: null,
    iconName: 'book',
    duration: '6 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-red-500',
    createdBy: 'Գարիկ Սարգսյան',
    institution: 'ՀԱՊՀ',
    preferIcon: true,
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: '4',
    title: 'JavaScript',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: null,
    iconName: 'files',
    duration: '3.5 ամիս',
    price: '58,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-yellow-500',
    createdBy: 'Անի Մուրադյան',
    institution: 'ՀԱՀ',
    preferIcon: true,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: '5',
    title: 'PHP',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: null,
    iconName: 'database',
    duration: '5 ամիս',
    price: '58,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-purple-500',
    createdBy: 'Վահե Ղազարյան',
    institution: 'ՀՊՄՀ',
    preferIcon: false,
    imageUrl: 'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: '6',
    title: 'C#/.NET',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: null,
    iconName: 'web',
    duration: '6 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-green-500',
    createdBy: 'Տիգրան Դավթյան',
    institution: 'ՀՌԱՀ',
    preferIcon: false,
    imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80'
  }
];

const ProfessionalCoursesSection: React.FC = () => {
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ProfessionalCourse | null>(null);
  const [courses, setCourses] = useState<ProfessionalCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const fetchedCourses = await getAllCourses();
        if (fetchedCourses && fetchedCourses.length > 0) {
          setCourses(fetchedCourses);
        } else {
          console.log('No courses found, using initial data');
          setCourses(initialProfessionalCourses);
          localStorage.setItem('professionalCourses', JSON.stringify(initialProfessionalCourses));
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setHasError(true);
        // Safely fall back to initial courses
        try {
          setCourses(initialProfessionalCourses);
          localStorage.setItem('professionalCourses', JSON.stringify(initialProfessionalCourses));
        } catch (fallbackError) {
          console.error('Error setting fallback courses:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  useEffect(() => {
    const handleCourseUpdated = (event: CustomEvent<ProfessionalCourse>) => {
      try {
        const updatedCourse = event.detail;
        
        console.log('Course updated event received:', updatedCourse);
        
        setCourses(prevCourses => {
          try {
            // Create a deep copy to ensure no reference issues
            const coursesCopy = JSON.parse(JSON.stringify(prevCourses));
            const courseIndex = coursesCopy.findIndex((c: ProfessionalCourse) => c.id === updatedCourse.id);
            
            if (courseIndex !== -1) {
              // Update existing course
              coursesCopy[courseIndex] = updatedCourse;
            } else {
              // Add new course
              coursesCopy.push(updatedCourse);
            }
            
            return coursesCopy;
          } catch (error) {
            console.error('Error updating courses state:', error);
            return prevCourses; // Return previous state if error occurs
          }
        });
      } catch (error) {
        console.error('Error handling course updated event:', error);
      }
    };

    window.addEventListener(COURSE_UPDATED_EVENT, handleCourseUpdated as EventListener);
    
    return () => {
      window.removeEventListener(COURSE_UPDATED_EVENT, handleCourseUpdated as EventListener);
    };
  }, []);

  useEffect(() => {
    console.log('Setting up Supabase realtime subscription for courses table');
    
    const channel = supabase
      .channel('public:courses-changes')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'courses' 
        }, 
        async (payload: RealtimePostgresChangesPayload<{[key: string]: any}>) => {
          try {
            console.log('Realtime update received from Supabase:', payload);
            
            if (payload.new && typeof payload.new === 'object' && 'id' in payload.new) {
              // For INSERT and UPDATE events
              const courseId = String(payload.new.id);
              
              try {
                const updatedCourse = await getCourseById(courseId);
                
                if (updatedCourse) {
                  console.log('Fetched updated course data:', updatedCourse);
                  
                  setCourses(prevCourses => {
                    try {
                      // Create a deep copy to ensure no reference issues
                      const coursesCopy = JSON.parse(JSON.stringify(prevCourses));
                      const courseIndex = coursesCopy.findIndex((c: ProfessionalCourse) => c.id === updatedCourse.id);
                      
                      if (courseIndex !== -1) {
                        // Update existing course
                        coursesCopy[courseIndex] = updatedCourse;
                      } else {
                        // Add new course
                        coursesCopy.push(updatedCourse);
                      }
                      
                      return coursesCopy;
                    } catch (error) {
                      console.error('Error updating courses state:', error);
                      return prevCourses; // Return previous state if error occurs
                    }
                  });
                  
                  if (payload.eventType === 'INSERT') {
                    toast.info(`Նոր դասընթաց ավելացվել է: ${updatedCourse.title}`);
                  } else if (payload.eventType === 'UPDATE') {
                    toast.info(`${updatedCourse.title} դասընթացը թարմացվել է`);
                  }
                }
              } catch (courseError) {
                console.error('Error fetching updated course:', courseError);
              }
            } else if (payload.eventType === 'DELETE' && payload.old && typeof payload.old === 'object' && 'id' in payload.old) {
              // For DELETE events
              const deletedId = String(payload.old.id);
              console.log('Course deleted:', deletedId);
              
              setCourses(prevCourses => {
                try {
                  return prevCourses.filter(c => c.id !== deletedId);
                } catch (error) {
                  console.error('Error filtering courses after delete:', error);
                  return prevCourses;
                }
              });
              toast.info('Դասընթացը հեռացվել է');
            }
          } catch (error) {
            console.error('Error handling course realtime update:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });
    
    const lessonsChannel = supabase
      .channel('public:course_lessons-changes')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'course_lessons' 
        }, 
        async (payload: RealtimePostgresChangesPayload<{[key: string]: any}>) => {
          try {
            console.log('Lesson update received:', payload);
            
            if (payload.new && typeof payload.new === 'object' && 'course_id' in payload.new) {
              const courseId = String(payload.new.course_id);
              
              try {
                const updatedCourse = await getCourseById(courseId);
                
                if (updatedCourse) {
                  setCourses(prevCourses => {
                    try {
                      // Create a deep copy to ensure no reference issues
                      const coursesCopy = JSON.parse(JSON.stringify(prevCourses));
                      const courseIndex = coursesCopy.findIndex((c: ProfessionalCourse) => c.id === updatedCourse.id);
                      
                      if (courseIndex !== -1) {
                        // Update existing course
                        coursesCopy[courseIndex] = updatedCourse;
                      }
                      
                      return coursesCopy;
                    } catch (error) {
                      console.error('Error updating courses after lesson change:', error);
                      return prevCourses;
                    }
                  });
                  
                  toast.info(`${updatedCourse.title} դասընթացի դասերը թարմացվել են`);
                }
              } catch (courseError) {
                console.error('Error fetching course after lesson update:', courseError);
              }
            }
          } catch (error) {
            console.error('Error handling lesson realtime update:', error);
          }
        }
      )
      .subscribe();
    
    return () => {
      console.log('Cleaning up realtime subscriptions');
      supabase.removeChannel(channel);
      supabase.removeChannel(lessonsChannel);
    };
  }, []);

  const handleEditCourse = async () => {
    if (!selectedCourse) return;

    try {
      const success = await saveCourseChanges(selectedCourse);
      if (success) {
        toast.success('Դասընթացը հաջողությամբ թարմացվել է');
        setIsEditDialogOpen(false);
        
        // Refresh the course list to ensure all data is synced
        try {
          const updatedCourses = await getAllCourses();
          if (updatedCourses && updatedCourses.length > 0) {
            setCourses(updatedCourses);
          }
        } catch (refreshError) {
          console.error('Error refreshing courses:', refreshError);
        }
      } else {
        toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
    }
  };

  const openEditDialog = (course: ProfessionalCourse) => {
    try {
      console.log("Opening edit dialog for course:", course);
      // Create a deep copy to avoid reference issues
      const courseCopy = createCourseDeepCopy(course);
      setSelectedCourse(courseCopy);
      setIsEditDialogOpen(true);
    } catch (error) {
      console.error('Error opening edit dialog:', error);
      toast.error('Չհաջողվեց բացել խմբագրման երկխոսությունը');
    }
  };
  
  const canEditCourse = (course: ProfessionalCourse) => {
    return user && (user.role === 'admin' || course.createdBy === user.name);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Բեռնում...</p>
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել։</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Փորձել կրկին
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <FadeIn>
          <h2 className="text-3xl font-bold mb-2 text-center">
            Ծրագրավորման դասընթացներ
          </h2>
        </FadeIn>
        
        <FadeIn delay="delay-100">
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
            Ծրագրավորման դասընթացներ նախատեսված սկսնակների համար
          </p>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <FadeIn key={course.id} delay="delay-200" className="flex">
              <ProfessionalCourseCard 
                course={course}
                onEdit={() => openEditDialog(course)}
                isAdmin={user?.role === 'admin'}
                canEdit={canEditCourse(course)}
              />
            </FadeIn>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button asChild variant="outline">
            <Link to="/courses">
              Դիտել բոլոր դասընթացները
            </Link>
          </Button>
        </div>
      </div>

      {selectedCourse && (
        <EditProfessionalCourseDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          handleEditCourse={handleEditCourse}
        />
      )}
    </section>
  );
};

export default ProfessionalCoursesSection;
