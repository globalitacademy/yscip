
import React, { useEffect, useState } from 'react';
import { LogIn, BookOpen, ClipboardCheck, GraduationCap, FileCode, Clock, Code, Globe, Database, Layers, Shield, Smartphone, Monitor, PenTool, Image, Layout } from 'lucide-react';
import { FadeIn, SlideUp, StaggeredContainer } from '@/components/LocalTransitions';
import { Course } from '@/components/courses/types';

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

interface ModuleCardProps {
  number: number;
  title: string;
  icon: React.ElementType;
  delay: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ number, title, icon: Icon, delay }) => {
  const colors = [
    "bg-blue-100 text-blue-600 border-blue-200",
    "bg-green-100 text-green-600 border-green-200",
    "bg-purple-100 text-purple-600 border-purple-200",
    "bg-orange-100 text-orange-600 border-orange-200",
    "bg-pink-100 text-pink-600 border-pink-200",
    "bg-indigo-100 text-indigo-600 border-indigo-200",
    "bg-teal-100 text-teal-600 border-teal-200",
    "bg-amber-100 text-amber-600 border-amber-200",
    "bg-cyan-100 text-cyan-600 border-cyan-200",
    "bg-rose-100 text-rose-600 border-rose-200",
    "bg-lime-100 text-lime-600 border-lime-200",
    "bg-emerald-100 text-emerald-600 border-emerald-200",
    "bg-sky-100 text-sky-600 border-sky-200",
  ];
  
  const colorClass = colors[(number - 1) % colors.length];
  
  return (
    <SlideUp delay={delay} className="flex flex-col">
      <div className={`p-6 rounded-lg border ${colorClass} flex flex-col items-center transition-transform hover:scale-105`}>
        <div className="rounded-full bg-white p-3 mb-4">
          <Icon className={colorClass.split(' ')[1]} size={28} />
        </div>
        <div className="text-sm font-semibold mb-1">{number}.</div>
        <h3 className="text-center font-medium">{title}</h3>
      </div>
    </SlideUp>
  );
};

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

  const educationalModules = [
    { number: 1, title: "Ալգորիթմների տարրերի կիրառում", icon: Code },
    { number: 2, title: "Ծրագրավորման հիմունքներ", icon: FileCode },
    { number: 3, title: "Օբյեկտ կողմնորոշված ծրագրավորում", icon: Layers },
    { number: 4, title: "Համակարգչային ցանցեր", icon: Globe },
    { number: 5, title: "Ստատրիկ վեբ կայքերի նախագծում", icon: Layout },
    { number: 6, title: "Ջավասկրիպտի կիրառումը", icon: Code },
    { number: 7, title: "Ռելյացիոն տվյալների բազաների նախագծում", icon: Database },
    { number: 8, title: "Ոչ Ռելյացիոն տվյալների բազաների նախագծում", icon: Database },
    { number: 9, title: "Դինաﬕկ վեբ կայքերի նախագծում", icon: Monitor },
    { number: 10, title: "Վեկտորային գրաֆիկա", icon: PenTool },
    { number: 11, title: "Կետային գրաֆիկա", icon: Image },
    { number: 12, title: "Գրաֆիկական ինտերֆեյսի ծրագրավորում", icon: Smartphone },
    { number: 13, title: "Տեղեկատվության անվտանգություն", icon: Shield },
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
        
        {/* Educational Modules Section */}
        <div className="mt-24">
          <FadeIn delay="delay-100">
            <h2 className="text-3xl font-bold mb-4 text-center">
              Ուսումնական մոդուլներ
            </h2>
          </FadeIn>
          
          <FadeIn delay="delay-200">
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Ուսումնասիրեք մեր մոդուլները հերթականությամբ՝ սկսած հիմնական ալգորիթմներից մինչև առաջադեմ ծրագրավորում
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {educationalModules.map((module, index) => (
              <ModuleCard
                key={index}
                number={module.number}
                title={module.title}
                icon={module.icon}
                delay={`delay-${100 * (index % 5 + 1)}`}
              />
            ))}
          </div>
        </div>
        
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
                  <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ClipboardCheck className="w-4 h-4 mr-1" />
                    <span>{course.modules.length} մոդուլ</span>
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
