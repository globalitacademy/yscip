import React, { useState, useEffect } from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { Button } from '@/components/ui/button';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe, User, Building, Pencil, Plus, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import EditProfessionalCourseDialog from './EditProfessionalCourseDialog';
import { useAuth } from '@/contexts/AuthContext';
import { saveCourseChanges } from './utils/courseUtils';
import { toast } from 'sonner';
import AddProfessionalCourseDialog from './AddProfessionalCourseDialog';
import { fetchAllCourses } from './utils/courseUtils';

interface ProfessionalCoursesSectionProps {
  isAdminView?: boolean;
}

const professionalCourses: ProfessionalCourse[] = [
  {
    id: '1',
    title: 'WEB Front-End',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <Code className="w-16 h-16" />,
    duration: '9 ամիս',
    price: '58,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-amber-500',
    createdBy: 'Արամ Հակոբյան',
    institution: 'ՀՊՏՀ',
    isPersistent: true
  },
  {
    id: '2',
    title: 'Python (ML / AI)',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <BrainCircuit className="w-16 h-16" />,
    duration: '7 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-blue-500',
    createdBy: 'Լիլիթ Մարտիրոսյան',
    institution: 'ԵՊՀ'
  },
  {
    id: '3',
    title: 'Java',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <BookText className="w-16 h-16" />,
    duration: '6 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-red-500',
    createdBy: 'Գարիկ Սարգսյան',
    institution: 'ՀԱՊՀ'
  },
  {
    id: '4',
    title: 'JavaScript',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <FileCode className="w-16 h-16" />,
    duration: '3.5 ամիս',
    price: '58,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-yellow-500',
    createdBy: 'Անի Մուրադյան',
    institution: 'ՀԱՀ'
  },
  {
    id: '5',
    title: 'PHP',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <Database className="w-16 h-16" />,
    duration: '5 ամիս',
    price: '58,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-purple-500',
    createdBy: 'Վահե Ղազարյան',
    institution: 'ՀՊՄՀ'
  },
  {
    id: '6',
    title: 'C#/.NET',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <Globe className="w-16 h-16" />,
    duration: '6 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-green-500',
    createdBy: 'Տիգրան Դավթյան',
    institution: 'ՀՌԱՀ'
  }
];

const ProfessionalCoursesSection: React.FC<ProfessionalCoursesSectionProps> = ({ isAdminView = false }) => {
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ProfessionalCourse | null>(null);
  const [courses, setCourses] = useState<ProfessionalCourse[]>(professionalCourses);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const fetchedCourses = await fetchAllCourses();
        if (fetchedCourses.length > 0) {
          setCourses(fetchedCourses);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
      }
    };
    
    loadCourses();
  }, []);

  const handleEditCourse = async () => {
    if (!selectedCourse) return;

    if (selectedCourse.isPersistent) {
      toast.error('Հիմնական դասընթացները չեն կարող խմբագրվել');
      setIsEditDialogOpen(false);
      return;
    }

    try {
      const success = await saveCourseChanges(selectedCourse);
      if (success) {
        const updatedCourses = courses.map(course => 
          course.id === selectedCourse.id ? { ...selectedCourse } : course
        );
        
        setCourses(updatedCourses);
        
        localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
        
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

  const handleAddCourse = (newCourse: ProfessionalCourse) => {
    setCourses([...courses, newCourse]);
    setIsAddDialogOpen(false);
    toast.success('Դասընթացը հաջողությամբ ավելացվել է');
  };

  const openEditDialog = (course: ProfessionalCourse) => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteCourse = async (id: string) => {
    const courseToDelete = courses.find(course => course.id === id);
    if (courseToDelete?.isPersistent) {
      toast.error('Հիմնական դասընթացները չեն կարող ջնջվել');
      return;
    }
    
    try {
      const updatedCourses = courses.filter(course => course.id !== id);
      setCourses(updatedCourses);
      
      const { error } = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      })
      .then(res => res.json());
      
      if (error) throw new Error(error);
      
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
      
      toast.success('Դասընթացը հաջողությամբ ջնջվել է');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
      
      const updatedCourses = await fetchAllCourses();
      setCourses(updatedCourses);
    }
  };
  
  const canEditCourse = (course: ProfessionalCourse) => {
    return user && (user.role === 'admin' || course.createdBy === user.name);
  };

  return (
    <section className={`py-8 ${!isAdminView ? 'bg-white' : ''}`}>
      <div className="container mx-auto px-4">
        {!isAdminView && (
          <>
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
          </>
        )}
        
        {isAdminView && user && (user.role === 'admin' || user.role === 'instructor') && (
          <div className="flex justify-end mb-6">
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Ավելացնել դասընթաց
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <FadeIn key={course.id} delay="delay-200" className="flex">
              <Card className="flex flex-col w-full hover:shadow-md transition-shadow relative">
                <div className="absolute top-4 left-4 flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full z-10">
                  <Building size={12} className="mr-1" />
                  <span>{course.institution}</span>
                </div>

                {course.isPersistent && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gray-100 px-2 py-1 rounded-full flex items-center">
                      <Lock size={12} className="text-gray-500" />
                    </div>
                  </div>
                )}

                {canEditCourse(course) && !course.isPersistent && (
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
                    <div className="w-full h-32 mb-4 overflow-hidden rounded-md">
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
                    <div id={`course-icon-${course.id}`} className={`mb-4 ${course.color} mx-auto`}>
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
                  {isAdminView && user && (user.role === 'admin' || user.role === 'instructor') && !course.isPersistent && (
                    <div className="w-full flex justify-between gap-2">
                      <Button 
                        variant="outline"
                        className="flex-1"
                        asChild
                      >
                        <Link to={`/course/${course.id}`}>
                          Դիտել
                        </Link>
                      </Button>
                      <Button 
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </Button>
                    </div>
                  )}
                  
                  {(!isAdminView || !(user && (user.role === 'admin' || user.role === 'instructor'))) && (
                    <Button 
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <Link to={`/course/${course.id}`}>
                        Մանրամասն
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </FadeIn>
          ))}
        </div>

        {!isAdminView && (
          <div className="flex justify-center mt-12">
            <Button asChild variant="outline">
              <Link to="/courses">
                Դիտել բոլոր դասընթացները
              </Link>
            </Button>
          </div>
        )}
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
      
      <AddProfessionalCourseDialog 
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddCourse={handleAddCourse}
      />
    </section>
  );
};

export default ProfessionalCoursesSection;
