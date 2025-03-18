
import React, { useEffect, useState } from 'react';
import { LogIn, BookOpen, ClipboardCheck, GraduationCap, FileCode, Clock } from 'lucide-react';
import { FadeIn, SlideUp, StaggeredContainer } from '@/components/LocalTransitions';
import { Course } from '@/components/courses/types';
import ModulesInfographic from './ModulesInfographic';

const stageColors = {
  admission: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    icon: "text-blue-500",
    line: "bg-blue-400"
  },
  firstYear: {
    bg: "bg-green-100",
    text: "text-green-600",
    icon: "text-green-500",
    line: "bg-green-400"
  },
  secondYear: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    icon: "text-purple-500",
    line: "bg-purple-400"
  },
  thirdYear: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    icon: "text-orange-500",
    line: "bg-orange-400"
  },
  fourthYear: {
    bg: "bg-pink-100",
    text: "text-pink-600",
    icon: "text-pink-500",
    line: "bg-pink-400"
  }
};

interface CycleStageProps {
  icon: React.ElementType;
  title: string;
  description: string;
  colorScheme: typeof stageColors.admission;
  delay: string;
  isLast?: boolean;
}

const CycleStage: React.FC<CycleStageProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  colorScheme,
  delay,
  isLast = false
}) => (
  <SlideUp delay={delay} className="flex flex-col items-center relative">
    <div className={`p-4 rounded-full ${colorScheme.bg} ${colorScheme.icon} mb-4 z-10`}>
      <Icon size={32} />
    </div>
    <h3 className={`text-lg font-medium mb-2 ${colorScheme.text}`}>{title}</h3>
    <p className="text-sm text-muted-foreground text-center max-w-[250px]">{description}</p>
    
    {!isLast && (
      <div className={`hidden md:block absolute top-6 left-[calc(50%+40px)] w-[calc(100%-80px)] h-1 ${colorScheme.line}`} 
           style={{ transform: 'translateY(16px)' }} />
    )}
  </SlideUp>
);

const EducationalCycleInfographic: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  
  useEffect(() => {
    // Load courses from localStorage
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
      try {
        const parsedCourses = JSON.parse(storedCourses);
        setCourses(parsedCourses);
      } catch (e) {
        console.error('Error parsing stored courses:', e);
      }
    }
  }, []);

  const stages = [
    {
      icon: LogIn,
      title: "1. Ընդունելություն",
      description: "Փաստաթղթերի ընդունում, քննություններ և դիմորդների ընդունելության գործընթաց։",
      colorScheme: stageColors.admission,
      delay: "delay-100"
    },
    {
      icon: BookOpen,
      title: "2. Առաջին կուրս",
      description: "Հիմնարար առարկաներ, ծրագրավորման լեզուների և ալգորիթմների ուսուցում։",
      colorScheme: stageColors.firstYear,
      delay: "delay-300"
    },
    {
      icon: ClipboardCheck,
      title: "3. Երկրորդ կուրս",
      description: "Խորացված ծրագրավորում, տվյալների կառուցվածքներ և ճարտարապետություն։",
      colorScheme: stageColors.secondYear,
      delay: "delay-500"
    },
    {
      icon: FileCode,
      title: "4. Երրորդ կուրս",
      description: "Մասնագիտական առարկաներ, պրակտիկա և կուրսային աշխատանքներ։",
      colorScheme: stageColors.thirdYear,
      delay: "delay-700"
    },
    {
      icon: GraduationCap,
      title: "5. Չորրորդ կուրս",
      description: "Դիպլոմային նախագծի պատրաստում, պաշտպանություն և ավարտական քննություններ։",
      colorScheme: stageColors.fourthYear,
      delay: "delay-900",
      isLast: true
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <FadeIn delay="delay-100">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Ուսումնական ցիկլ
          </h2>
        </FadeIn>
        
        <FadeIn delay="delay-200">
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Ծանոթացեք ուսման ամբողջ ընթացքին՝ ընդունելությունից մինչև ավարտական դիպլոմի ստացում
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-0">
          {stages.map((stage, index) => (
            <CycleStage 
              key={index}
              icon={stage.icon}
              title={stage.title}
              description={stage.description}
              colorScheme={stage.colorScheme}
              delay={stage.delay}
              isLast={stage.isLast}
            />
          ))}
        </div>
        
        {/* Mobile timeline visualization */}
        <div className="md:hidden mt-4">
          {stages.slice(0, -1).map((stage, index) => (
            <div 
              key={index} 
              className={`h-16 w-1 ${stage.colorScheme.line} mx-auto`}
            />
          ))}
        </div>
        
        {/* Educational Modules Infographic */}
        <ModulesInfographic />
        
        {/* Courses section added within educational cycle */}
        {courses.length > 0 && (
          <div className="mt-24">
            <FadeIn delay="delay-100">
              <h2 className="text-3xl font-bold mb-4 text-center">
                Մեր կուրսերը
              </h2>
            </FadeIn>
            
            <FadeIn delay="delay-200">
              <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                Տեսեք մեր առաջարկած կրթական ծրագրերը ուսումնական ցիկլի շրջանակներում
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ClipboardCheck className="w-4 h-4 mr-1" />
                    <span>{course.modules?.length || 0} մոդուլ</span>
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EducationalCycleInfographic;
