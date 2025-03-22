
import React, { useState, useEffect } from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { Button } from '@/components/ui/button';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe, User, Building, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import EditProfessionalCourseDialog from './EditProfessionalCourseDialog';
import { useAuth } from '@/contexts/AuthContext';
import { 
  saveCourseChanges, 
  COURSE_UPDATED_EVENT,
  getAllCourses, 
  subscribeToRealtimeUpdates
} from './utils/courseUtils';
import { toast } from 'sonner';

const ProfessionalCoursesSection: React.FC = () => {
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ProfessionalCourse | null>(null);
  const [courses, setCourses] = useState<ProfessionalCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch courses from Supabase on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const fetchedCourses = await getAllCourses();
        if (fetchedCourses && fetchedCourses.length > 0) {
          setCourses(fetchedCourses);
        } else {
          // If no courses found, show message
          toast.info('Դասընթացներ չեն գտնվել');
          setCourses([]);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել');
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  // Listen for course updates from local events
  useEffect(() => {
    const handleCourseUpdated = (event: CustomEvent<ProfessionalCourse>) => {
      const updatedCourse = event.detail;
      
      console.log('Course updated event received:', updatedCourse);
      
      setCourses(prevCourses => {
        const updated = prevCourses.map(course => 
          course.id === updatedCourse.id ? updatedCourse : course
        );
        return updated;
      });
    };

    window.addEventListener(COURSE_UPDATED_EVENT, handleCourseUpdated as EventListener);
    
    return () => {
      window.removeEventListener(COURSE_UPDATED_EVENT, handleCourseUpdated as EventListener);
    };
  }, []);

  // Subscribe to Supabase realtime updates
  useEffect(() => {
    const handleRealtimeUpdate = (updatedCourse: ProfessionalCourse) => {
      console.log('Realtime update for course:', updatedCourse);
      
      setCourses(prevCourses => {
        const existingCourseIndex = prevCourses.findIndex(course => course.id === updatedCourse.id);
        
        if (existingCourseIndex !== -1) {
          // Update existing course
          const updated = [...prevCourses];
          updated[existingCourseIndex] = updatedCourse;
          return updated;
        } else {
          // Add new course
          return [...prevCourses, updatedCourse];
        }
      });
      
      // Show a toast notification for the update
      toast.info(`${updatedCourse.title} դասընթացը թարմացվել է`);
    };
    
    // Set up subscription
    const unsubscribe = subscribeToRealtimeUpdates(handleRealtimeUpdate);
    
    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const handleEditCourse = async () => {
    if (!selectedCourse) return;

    try {
      const success = await saveCourseChanges(selectedCourse);
      if (success) {
        toast.success('Դասընթացը հաջողությամբ թարմացվել է');
        setIsEditDialogOpen(false);
      } else {
        toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
    }
  };

  const openEditDialog = (course: ProfessionalCourse) => {
    setSelectedCourse({...course});
    setIsEditDialogOpen(true);
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
        
        {courses.length === 0 && !isLoading ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Դասընթացներ չեն գտնվել</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <FadeIn key={course.id} delay="delay-200" className="flex">
                <Card className="flex flex-col w-full hover:shadow-md transition-shadow relative">
                  {course.organizationLogo ? (
                    <div className="absolute top-4 left-4 flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full z-10">
                      <img 
                        src={course.organizationLogo} 
                        alt={course.institution}
                        className="w-6 h-6 mr-1 object-contain rounded-full"
                      />
                      <span>{course.institution}</span>
                    </div>
                  ) : (
                    <div className="absolute top-4 left-4 flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full z-10">
                      <Building size={12} className="mr-1" />
                      <span>{course.institution}</span>
                    </div>
                  )}

                  {canEditCourse(course) && (
                    <div className="absolute top-4 right-4 z-10">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 rounded-full" 
                        onClick={(e) => {
                          e.preventDefault();
                          openEditDialog(course);
                        }}
                      >
                        <Pencil size={12} />
                      </Button>
                    </div>
                  )}

                  <CardHeader className="pb-2 text-center pt-12 relative">
                    {course.imageUrl ? (
                      <div className="w-full h-32 mb-4 overflow-hidden rounded-md mt-4">
                        <img 
                          src={course.imageUrl} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const iconElement = document.getElementById(`course-icon-${course.id}`);
                            if (iconElement) iconElement.style.display = 'block';
                          }}
                        />
                      </div>
                    ) : (
                      <div id={`course-icon-${course.id}`} className={`mb-4 ${course.color} mx-auto mt-4`}>
                        {course.icon}
                      </div>
                    )}
                    <h3 className="font-bold text-xl">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.subtitle}</p>
                  </CardHeader>
                  
                  <CardContent className="flex-grow pb-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <User size={16} />
                      <span>Դասախոս՝ {course.createdBy}</span>
                    </div>
                    
                    <div className="flex justify-between w-full text-sm mt-auto">
                      <span>{course.duration}</span>
                      <span className="font-semibold">{course.price}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-4">
                    <Button 
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <Link to={`/course/${course.id}`}>
                        Մանրամասն
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </FadeIn>
            ))}
          </div>
        )}

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
