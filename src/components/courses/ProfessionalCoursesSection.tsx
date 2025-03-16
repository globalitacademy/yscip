
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { Button } from '@/components/ui/button';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfessionalCourse {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  duration: string;
  price: string;
  buttonText: string;
  color: string;
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
    color: 'text-amber-500'
  },
  {
    id: '2',
    title: 'Python (ML / AI)',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <BrainCircuit className="w-16 h-16" />,
    duration: '7 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-blue-500'
  },
  {
    id: '3',
    title: 'Java',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <BookText className="w-16 h-16" />,
    duration: '6 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-red-500'
  },
  {
    id: '4',
    title: 'JavaScript',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <FileCode className="w-16 h-16" />,
    duration: '3.5 ամիս',
    price: '58,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-yellow-500'
  },
  {
    id: '5',
    title: 'PHP',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <Database className="w-16 h-16" />,
    duration: '5 ամիս',
    price: '58,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-purple-500'
  },
  {
    id: '6',
    title: 'C#/.NET',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: <Globe className="w-16 h-16" />,
    duration: '6 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-green-500'
  }
];

const ProfessionalCoursesSection: React.FC = () => {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {professionalCourses.map((course) => (
            <FadeIn key={course.id} delay="delay-200" className="flex">
              <div className="bg-white rounded-lg border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow flex-1">
                <div className={`mb-6 ${course.color}`}>
                  {course.icon}
                </div>
                
                <h3 className="font-bold text-xl mb-1">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{course.subtitle}</p>
                
                <Button 
                  variant="outline" 
                  className="rounded-full mb-6"
                >
                  {course.buttonText}
                </Button>
                
                <div className="mt-auto flex justify-between w-full text-sm">
                  <span>{course.duration}</span>
                  <span className="font-semibold">{course.price}</span>
                </div>
              </div>
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
