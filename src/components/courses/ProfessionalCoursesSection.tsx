
import React, { useEffect, useState } from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { Button } from '@/components/ui/button';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe, User, Building, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseManagement } from './useCourseManagement';
import { Course } from './types';
import { toast } from 'sonner';

// Interface for professional courses display
interface ProfessionalCourse {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  duration: string;
  price: string;
  buttonText: string;
  color: string;
  createdBy: string;
  institution: string;
}

// Icons mapping for different course types
const courseIcons: Record<string, React.ReactNode> = {
  'WEB Front-End': <Code className="w-16 h-16" />,
  'Python (ML / AI)': <BrainCircuit className="w-16 h-16" />,
  'Java': <BookText className="w-16 h-16" />,
  'JavaScript': <FileCode className="w-16 h-16" />,
  'PHP': <Database className="w-16 h-16" />,
  'C#/.NET': <Globe className="w-16 h-16" />
};

// Colors mapping for different course types
const courseColors: Record<string, string> = {
  'WEB Front-End': 'text-amber-500',
  'Python (ML / AI)': 'text-blue-500',
  'Java': 'text-red-500',
  'JavaScript': 'text-yellow-500',
  'PHP': 'text-purple-500',
  'C#/.NET': 'text-green-500'
};

// Default courses if no courses are available from the database
const defaultProfessionalCourses: ProfessionalCourse[] = [
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
    institution: 'ՀՊՏՀ'
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

const ProfessionalCoursesSection: React.FC = () => {
  const { user } = useAuth();
  const { courses } = useCourseManagement();
  const [professionalCourses, setProfessionalCourses] = useState<ProfessionalCourse[]>(defaultProfessionalCourses);
  const navigate = useNavigate();

  // Check if user has permissions to add courses
  const isAdmin = user?.role === 'admin';
  const isLecturer = ['lecturer', 'instructor', 'supervisor', 'project_manager'].includes(user?.role || '');
  const isEmployer = user?.role === 'employer';
  const canManageCourses = isAdmin || isLecturer || isEmployer;

  // Transform courses from database to ProfessionalCourse format
  useEffect(() => {
    if (courses && courses.length > 0) {
      const transformedCourses: ProfessionalCourse[] = courses.map((course: Course) => {
        // Determine icon and color based on course name or use default
        const icon = courseIcons[course.name] || <Code className="w-16 h-16" />;
        const color = courseColors[course.name] || 'text-gray-500';
        
        return {
          id: course.id,
          title: course.name,
          subtitle: 'ԴԱՍԸՆԹԱՑ',
          icon: icon,
          duration: course.duration || '6 ամիս',
          price: '58,000 ֏', // Default price, can be added to Course type if needed
          buttonText: 'Դիտել',
          color: color,
          createdBy: course.createdBy || 'Admin',
          institution: course.specialization || 'ԵՊՀ'
        };
      });
      
      setProfessionalCourses(transformedCourses);
    }
  }, [courses]);

  const handleAddCourse = () => {
    if (!user) {
      toast.error('Խնդրում ենք մուտք գործել համակարգ նախքան դասընթաց ավելացնելը');
      return;
    }
    
    navigate('/courses');
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <FadeIn>
              <h2 className="text-3xl font-bold mb-2">
                Ծրագրավորման դասընթացներ
              </h2>
            </FadeIn>
            
            <FadeIn delay="delay-100">
              <p className="text-muted-foreground max-w-2xl mb-2">
                Ծրագրավորման դասընթացներ նախատեսված սկսնակների համար
              </p>
            </FadeIn>
          </div>
          
          {canManageCourses && (
            <FadeIn delay="delay-150">
              <Button 
                onClick={handleAddCourse}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Ավելացնել դասընթաց
              </Button>
            </FadeIn>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionalCourses.map((course) => (
            <FadeIn key={course.id} delay="delay-200" className="flex">
              <Card className="flex flex-col w-full hover:shadow-md transition-shadow relative">
                <div className="absolute top-4 left-4 flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full z-10">
                  <Building size={12} className="mr-1" />
                  <span>{course.institution}</span>
                </div>
                <CardHeader className="pb-2 text-center pt-12">
                  <div className={`mb-4 ${course.color} mx-auto`}>
                    {course.icon}
                  </div>
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
    </section>
  );
};

export default ProfessionalCoursesSection;
