
import React, { useState, useEffect } from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { Button } from '@/components/ui/button';
import { Book, BrainCircuit, Building, Code, Database, FileCode, Globe, Pencil, User, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import EditProfessionalCourseDialog from './EditProfessionalCourseDialog';
import { useAuth } from '@/contexts/AuthContext';
import { saveCourseChanges, COURSE_UPDATED_EVENT, getAllCoursesFromLocalStorage, convertIconNameToComponent, getIconNameFromComponent } from './utils/courseUtils';
import { toast } from 'sonner';

const initialProfessionalCourses: ProfessionalCourse[] = [
  {
    id: '1',
    title: 'Web Front-End',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <Globe className="w-16 h-16" />,
    iconName: 'web',
    duration: '9 ամիս',
    price: '58,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-amber-500',
    createdBy: 'Արամ Հակոբյան',
    institution: 'ՀՊՏՀ',
    imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    description: 'Սովորեք HTML, CSS, և JavaScript հիմունքներ, ինչպես նաև ժամանակակից Front-End շրջանակներ՝ ինչպիսիք են React, Angular և Vue:',
    lessons: [
      { title: 'HTML և CSS հիմունքներ', duration: '20 ժամ' },
      { title: 'JavaScript ինտենսիվ', duration: '30 ժամ' },
      { title: 'React ծրագրավորում', duration: '40 ժամ' }
    ],
    requirements: [
      'Համակարգչային բազային գիտելիքներ',
      'Տրամաբանական մտածելակերպ'
    ],
    outcomes: [
      'Կարողանալ մշակել բարդ ինտերակտիվ կայքեր',
      'Աշխատել ժամանակակից JavaScript շրջանակներով',
      'Ստեղծել մասշտաբավորվող կայքեր'
    ]
  },
  {
    id: '2',
    title: 'Python (ML)',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <BrainCircuit className="w-16 h-16" />,
    iconName: 'ai',
    duration: '7 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-blue-500',
    createdBy: 'Լիլիթ Մարտիրոսյան',
    institution: 'ԵՊՀ',
    imageUrl: 'https://images.unsplash.com/photo-1526379879527-8559ecfd8bf7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    description: 'Սովորեք մեքենայական ուսուցման հիմնական սկզբունքները և ալգորիթմները Python-ով։ Ծանոթացեք տվյալների վերլուծության և կանխատեսման մեթոդներին։',
    lessons: [
      { title: 'Python հիմունքներ', duration: '25 ժամ' },
      { title: 'Թվային վերլուծություն NumPy և Pandas', duration: '30 ժամ' },
      { title: 'Մեքենայական ուսուցման մոդելներ', duration: '40 ժամ' },
      { title: 'Խորը ուսուցում (Deep Learning)', duration: '45 ժամ' }
    ],
    requirements: [
      'Ծրագրավորման հիմնական գիտելիքներ',
      'Մաթեմատիկական վիճակագրության տարրական իմացություն'
    ],
    outcomes: [
      'Կառուցել և ուսուցանել մեքենայական ուսուցման մոդելներ',
      'Վերլուծել մեծ տվյալների բազաներ',
      'Մշակել տվյալների վիզուալիզացիաներ'
    ]
  },
  {
    id: '3',
    title: 'Java',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <Book className="w-16 h-16" />,
    iconName: 'book',
    duration: '6 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-red-500',
    createdBy: 'Գարիկ Սարգսյան',
    institution: 'ՀԱՊՀ',
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    description: 'Ուսումնասիրեք Java ծրագրավորման լեզուն և օբյեկտ-կողմնորոշված ծրագրավորման սկզբունքները։ Կառուցեք բազմապլատֆորմ հավելվածներ և աշխատեք տվյալների բազաների հետ։',
    lessons: [
      { title: 'Java հիմունքներ և սինտաքս', duration: '25 ժամ' },
      { title: 'Java OOP սկզբունքներ', duration: '30 ժամ' },
      { title: 'Java Spring շրջանակ', duration: '40 ժամ' }
    ],
    requirements: [
      'Ծրագրավորման հիմնական գիտելիքներ'
    ],
    outcomes: [
      'Մշակել Java սերվերային հավելվածներ',
      'Աշխատել տվյալների բազաների հետ',
      'Կառուցել բազմաշերտ Java հավելվածներ'
    ]
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
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    description: 'Խորացեք JavaScript լեզվի մեջ և սովորեք մշակել ինտերակտիվ վեբ կայքեր։ Ծանոթացեք ժամանակակից JavaScript շրջանակների հետ։',
    lessons: [
      { title: 'JavaScript հիմունքներ', duration: '20 ժամ' },
      { title: 'DOM մանիպուլյացիա', duration: '15 ժամ' },
      { title: 'JavaScript շրջանակներ (React, Vue)', duration: '30 ժամ' }
    ],
    requirements: [
      'HTML և CSS հիմնական գիտելիքներ'
    ],
    outcomes: [
      'Մշակել ինտերակտիվ վեբ կայքեր',
      'Ստեղծել միաէջանի հավելվածներ (SPA)',
      'Աշխատել API-ների հետ'
    ]
  },
  {
    id: '5',
    title: 'C++',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <Code className="w-16 h-16" />,
    iconName: 'code',
    duration: '5 ամիս',
    price: '62,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-purple-500',
    createdBy: 'Վահե Ղազարյան',
    institution: 'ՀՊՄՀ',
    imageUrl: 'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    description: 'Սովորեք C++ լեզուն՝ բարձր արդյունավետությամբ ծրագրեր և համակարգեր մշակելու համար։ Ուսումնասիրեք դասերը, օբյեկտները և արդյունավետ կոդավորման տեխնիկաները։',
    lessons: [
      { title: 'C++ հիմունքներ և սինտաքս', duration: '25 ժամ' },
      { title: 'C++ OOP և շաբլոններ', duration: '30 ժամ' },
      { title: 'Տվյալների կառուցվածքներ և ալգորիթմներ', duration: '35 ժամ' }
    ],
    requirements: [
      'Ծրագրավորման բազային գիտելիքներ',
      'Ալգորիթմական մտածելակերպ'
    ],
    outcomes: [
      'Մշակել օպտիմիզացված C++ ծրագրեր',
      'Կառուցել բարդ համակարգեր',
      'Աշխատել մեծածավալ տվյալների հետ'
    ]
  },
  {
    id: '6',
    title: 'C#/.NET',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <Database className="w-16 h-16" />,
    iconName: 'database',
    duration: '6 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-green-500',
    createdBy: 'Տիգրան Դավթյան',
    institution: 'ՀՌԱՀ',
    imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    description: 'Ուսումնասիրեք C# լեզուն և .NET շրջանակը՝ թվային և վեբ հավելվածներ մշակելու համար։ Սովորեք ASP.NET Core և աշխատեք տվյալների բազաների հետ։',
    lessons: [
      { title: 'C# հիմունքներ', duration: '25 ժամ' },
      { title: 'C# OOP սկզբունքներ', duration: '20 ժամ' },
      { title: 'ASP.NET Core ներածություն', duration: '30 ժամ' },
      { title: 'Entity Framework և SQL', duration: '30 ժամ' }
    ],
    requirements: [
      'Ծրագրավորման տարրական իմացություն',
      'Windows միջավայրի օգտագործման փորձ'
    ],
    outcomes: [
      'Մշակել .NET հավելվածներ',
      'Ստեղծել վեբ հավելվածներ ASP.NET-ով',
      'Աշխատել SQL տվյալների բազաների հետ'
    ]
  },
  {
    id: '7',
    title: 'Android',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <Smartphone className="w-16 h-16" />,
    iconName: 'smartphone',
    duration: '5 ամիս',
    price: '65,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-green-600',
    createdBy: 'Արման Պետրոսյան',
    institution: 'ԵՊՀ',
    imageUrl: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    description: 'Սովորեք Android բջջային հավելվածների մշակում Kotlin և Java լեզուներով։ Ուսումնասիրեք Android Studio, UI դիզայն և տվյալների պահպանում։',
    lessons: [
      { title: 'Kotlin հիմունքներ ծրագրավորողների համար', duration: '20 ժամ' },
      { title: 'Android UI դիզայն և լայաուտներ', duration: '25 ժամ' },
      { title: 'Android տվյալների պահպանում և ցանցային հարցումներ', duration: '30 ժամ' },
      { title: 'Android-ի համար Material Design', duration: '20 ժամ' }
    ],
    requirements: [
      'Java կամ Kotlin հիմնական գիտելիքներ',
      'Օբյեկտ-կողմնորոշված ծրագրավորման հասկացություններ'
    ],
    outcomes: [
      'Մշակել հարմարավետ Android հավելվածներ',
      'Աշխատել API-ների և տվյալների բազաների հետ',
      'Հրապարակել հավելվածներ Google Play Store-ում'
    ]
  }
];

const ProfessionalCoursesSection: React.FC = () => {
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ProfessionalCourse | null>(null);
  const [courses, setCourses] = useState<ProfessionalCourse[]>([]);

  // Initialize courses from localStorage or fall back to initial data
  useEffect(() => {
    const storedCourses = localStorage.getItem('professionalCourses');
    
    if (storedCourses) {
      try {
        const parsedCourses = JSON.parse(storedCourses);
        if (Array.isArray(parsedCourses) && parsedCourses.length > 0) {
          // Ensure each course has a properly rendered icon based on iconName
          const processedCourses = parsedCourses.map((course: ProfessionalCourse) => {
            if (course.iconName && !course.icon) {
              return {
                ...course,
                icon: convertIconNameToComponent(course.iconName)
              };
            }
            return course;
          });
          setCourses(processedCourses);
        } else {
          // Initialize with default data if stored data is empty or invalid
          setCourses(initialProfessionalCourses);
          localStorage.setItem('professionalCourses', JSON.stringify(initialProfessionalCourses));
        }
      } catch (e) {
        console.error('Error parsing stored courses:', e);
        setCourses(initialProfessionalCourses);
        localStorage.setItem('professionalCourses', JSON.stringify(initialProfessionalCourses));
      }
    } else {
      // No stored courses yet, initialize
      setCourses(initialProfessionalCourses);
      localStorage.setItem('professionalCourses', JSON.stringify(initialProfessionalCourses));
    }
  }, []);

  // Listen for course update events
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

    // Add event listener
    window.addEventListener(COURSE_UPDATED_EVENT, handleCourseUpdated as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener(COURSE_UPDATED_EVENT, handleCourseUpdated as EventListener);
    };
  }, []);

  const handleEditCourse = async () => {
    if (!selectedCourse) return;

    try {
      // Ensure the course has iconName set before saving
      if (selectedCourse.icon && !selectedCourse.iconName) {
        selectedCourse.iconName = getIconNameFromComponent(selectedCourse.icon);
      }
      
      const success = await saveCourseChanges(selectedCourse);
      if (success) {
        // Update was successful and event was dispatched via saveCourseChanges
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
  
  // Check if user can edit a course
  const canEditCourse = (course: ProfessionalCourse) => {
    return user && (user.role === 'admin' || course.createdBy === user.name);
  };

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
                <div className="absolute top-4 left-4 flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full z-10">
                  <Building size={12} className="mr-1" />
                  <span>{course.institution}</span>
                </div>

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
                    <div className="w-full h-32 mb-4 overflow-hidden rounded-md">
                      <img 
                        src={course.imageUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          e.currentTarget.style.display = 'none';
                          const iconElement = document.getElementById(`course-icon-${course.id}`);
                          if (iconElement) iconElement.style.display = 'block';
                        }}
                      />
                    </div>
                  ) : (
                    <div id={`course-icon-${course.id}`} className={`mb-4 ${course.color} mx-auto`}>
                      {course.icon || (course.iconName ? convertIconNameToComponent(course.iconName) : null)}
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
