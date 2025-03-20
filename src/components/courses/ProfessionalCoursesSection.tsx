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
  subscribeToRealtimeUpdates,
  getCourseById
} from './utils/courseUtils';
import { toast } from 'sonner';

const initialProfessionalCourses: ProfessionalCourse[] = [
  {
    id: '1',
    title: 'WEB Front-End',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <Code className="w-16 h-16" />,
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
    icon: <BrainCircuit className="w-16 h-16" />,
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
    icon: <BookText className="w-16 h-16" />,
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
    icon: <FileCode className="w-16 h-16" />,
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
    icon: <Database className="w-16 h-16" />,
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
    icon: <Globe className="w-16 h-16" />,
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

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const fetchedCourses = await getAllCourses();
        if (fetchedCourses && fetchedCourses.length > 0) {
          setCourses(fetchedCourses);
        } else {
          setCourses(initialProfessionalCourses);
          localStorage.setItem('professionalCourses', JSON.stringify(initialProfessionalCourses));
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses(initialProfessionalCourses);
        localStorage.setItem('professionalCourses', JSON.stringify(initialProfessionalCourses));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

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
        async (payload) => {
          console.log('Realtime update received from Supabase:', payload);
          
          if (payload.new && payload.new.id) {
            try {
              const updatedCourse = await getCourseById(payload.new.id);
              if (updatedCourse) {
                console.log('Fetched updated course data:', updatedCourse);
                
                setCourses(prevCourses => {
                  const courseExists = prevCourses.some(c => c.id === updatedCourse.id);
                  
                  if (courseExists) {
                    return prevCourses.map(course => 
                      course.id === updatedCourse.id ? updatedCourse : course
                    );
                  } else {
                    return [...prevCourses, updatedCourse];
                  }
                });
                
                if (payload.eventType === 'INSERT') {
                  toast.info(`Նոր դասընթաց ավելացվել է: ${updatedCourse.title}`);
                } else if (payload.eventType === 'UPDATE') {
                  toast.info(`${updatedCourse.title} դասընթացը թարմացվել է`);
                } else if (payload.eventType === 'DELETE') {
                  toast.info(`Դասընթացը հեռացվել է`);
                  setCourses(prevCourses => prevCourses.filter(c => c.id !== payload.old.id));
                }
              }
            } catch (error) {
              console.error('Error fetching updated course:', error);
            }
          } else if (payload.eventType === 'DELETE' && payload.old && payload.old.id) {
            console.log('Course deleted:', payload.old.id);
            setCourses(prevCourses => prevCourses.filter(c => c.id !== payload.old.id));
            toast.info('Դասընթացը հեռացվել է');
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
        async (payload) => {
          console.log('Lesson update received:', payload);
          
          if (payload.new && payload.new.course_id) {
            try {
              const updatedCourse = await getCourseById(payload.new.course_id);
              if (updatedCourse) {
                setCourses(prevCourses => {
                  return prevCourses.map(course => 
                    course.id === updatedCourse.id ? updatedCourse : course
                  );
                });
                
                toast.info(`${updatedCourse.title} դասընթացի դասերը թարմացվել են`);
              }
            } catch (error) {
              console.error('Error fetching course after lesson update:', error);
            }
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
