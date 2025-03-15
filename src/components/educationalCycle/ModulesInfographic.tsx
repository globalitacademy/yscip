import React, { useState } from 'react';
import { Code, FileCode, Layers, Globe, Layout, Database, Monitor, PenTool, Image, Smartphone, Shield, Clock, Check, X } from 'lucide-react';
import { FadeIn, SlideUp } from '@/components/LocalTransitions';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';

export interface EducationalModule {
  id: number;
  title: string;
  icon: React.ElementType;
  description?: string;
  status?: 'not-started' | 'in-progress' | 'completed';
  progress?: number;
  topics?: string[];
}

interface ModuleCardProps {
  module: EducationalModule;
  delay: string;
  showProgress: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, delay, showProgress }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
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
  
  const colorClass = colors[(module.id - 1) % colors.length];
  
  const getStatusIcon = () => {
    switch (module.status) {
      case 'completed':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'not-started':
      default:
        return <X className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const handleCardClick = () => {
    if (module.topics && module.topics.length > 0) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <SlideUp delay={delay} className="flex flex-col">
      <div 
        className={`flip-card ${isFlipped ? 'flipped' : ''}`}
        style={{ 
          perspective: '1000px',
          height: '280px' 
        }}
      >
        <div 
          className="flip-card-inner w-full h-full relative transition-transform duration-700 transform-style-preserve-3d"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <div 
            className={`flip-card-front absolute w-full h-full ${colorClass} border rounded-lg p-6 shadow-md flex flex-col items-center cursor-pointer`}
            onClick={handleCardClick}
            style={{ 
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="rounded-full bg-white p-3 mb-4 shadow-inner">
              <module.icon className={colorClass.split(' ')[1]} size={28} />
            </div>
            <div className="text-sm font-semibold mb-1">{module.id}.</div>
            <h3 className="text-center font-medium mb-2">{module.title}</h3>
            
            {showProgress && module.status && (
              <div className="mt-2 flex items-center gap-2">
                {getStatusIcon()}
                <span className="text-xs">
                  {module.status === 'completed' ? 'Ավարտված է' : 
                   module.status === 'in-progress' ? 'Ընթացքի մեջ է' : 
                   'Չսկսված'}
                </span>
              </div>
            )}
            
            {showProgress && module.progress !== undefined && (
              <div className="w-full mt-3">
                <Progress value={module.progress} className="h-2" />
                <p className="text-xs text-right mt-1">{module.progress}%</p>
              </div>
            )}
            
            {module.topics && module.topics.length > 0 && (
              <div className="mt-auto pt-4">
                <p className="text-xs italic">Սեղմեք թեմաները տեսնելու համար</p>
              </div>
            )}
          </div>
          
          <div 
            className={`flip-card-back absolute w-full h-full ${colorClass} border rounded-lg p-6 shadow-md flex flex-col cursor-pointer`}
            onClick={handleCardClick}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <h4 className="font-medium mb-2 text-center">{module.title} - Թեմաներ</h4>
            
            {module.topics && module.topics.length > 0 ? (
              <ul className="space-y-2 overflow-auto">
                {module.topics.map((topic, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-center italic">Թեմաներ չկան</p>
            )}
            
            <div className="mt-auto pt-4 text-center">
              <p className="text-xs italic">Սեղմեք քարտը շրջելու համար</p>
            </div>
          </div>
        </div>
      </div>
    </SlideUp>
  );
};

export const ModulesInfographic: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  const educationalModules: EducationalModule[] = [
    { 
      id: 1, 
      title: "Ալգորիթմների տարրերի կիրառում", 
      icon: Code, 
      status: 'completed', 
      progress: 100,
      topics: [
        "Ալգորիթմի հիմնական սահմանումները", 
        "Պարզ ալգորիթմների նախագծում",
        "Տրամաբանական կառուցվածքներ",
        "Կրկնվող գործողություններ"
      ]
    },
    { 
      id: 2, 
      title: "Ծրագրավորման հիմունքներ", 
      icon: FileCode, 
      status: 'completed', 
      progress: 100,
      topics: [
        "Փոփոխականներ և տիպեր",
        "Պայմանական կառուցվածքներ",
        "Ֆունկցիաներ և պրոցեդուրաներ",
        "Զանգվածներ և կոլեկցիաներ"
      ]
    },
    { 
      id: 3, 
      title: "Օբյեկտ կողմնորոշված ծրագրավորում", 
      icon: Layers, 
      status: 'in-progress', 
      progress: 75,
      topics: [
        "Դասեր և օբյեկտներ",
        "Ժառանգություն և պոլիմորֆիզմ",
        "Ինկապսուլյացիա",
        "Ինտերֆեյսներ և աբստրակտ դասեր"
      ]
    },
    { 
      id: 4, 
      title: "Համակարգչային ցանցեր", 
      icon: Globe, 
      status: 'in-progress', 
      progress: 40,
      topics: [
        "OSI մոդեل և TCP/IP",
        "Մարշրուտիզացիա և կոմուտացիա",
        "Հաղորդակարգեր և ծառայություններ",
        "Ցանցային անվտանգություն"
      ]
    },
    { 
      id: 5, 
      title: "Ստատրիկ վեբ կայքերի նախագծում", 
      icon: Layout, 
      status: 'not-started', 
      progress: 0,
      topics: [
        "HTML5 կառուցվածք",
        "CSS3 ձևավորում",
        "Ադապտիվ դիզայն",
        "Վեբ մատչելիություն"
      ]
    },
    { 
      id: 6, 
      title: "Ջավասկրիպտի կիրառումը", 
      icon: Code, 
      status: 'not-started', 
      progress: 0,
      topics: [
        "JavaScript հիմունքներ",
        "DOM մանիպուլյացիա",
        "Իրադարձությունների մշակում",
        "AJAX և Fetch API"
      ]
    },
    { 
      id: 7, 
      title: "Ռելյացիոն տվյալների բազաների նախագծում", 
      icon: Database, 
      status: 'not-started', 
      progress: 0,
      topics: [
        "SQL լեզու",
        "Տվյալների մոդելավորում",
        "Նորմալացման կանոններ",
        "Ինդեքսավորում և օպտիմիզացիա"
      ]
    },
    { 
      id: 8, 
      title: "Ոչ Ռելյացիոն տվյալների բազաների նախագծում", 
      icon: Database, 
      status: 'not-started', 
      progress: 0,
      topics: [
        "NoSQL տեսակներ",
        "Document և Key-Value պահեստներ",
        "Սխեմաների նախագծում",
        "Մասշտաբավորում"
      ]
    },
    { 
      id: 9, 
      title: "Դինաﬕկ վեբ կայքերի նախագծում", 
      icon: Monitor, 
      status: 'not-started', 
      progress: 0,
      topics: [
        "Սերվերային տեխնոլոգիաներ",
        "MVC արխիտեկտուրա",
        "API-ներ և միկրոսերվիսներ",
        "WebSockets և իրական ժամանակի ծրագրեր"
      ]
    },
    { 
      id: 10, 
      title: "Վեկտորային գրաֆիկա", 
      icon: PenTool, 
      status: 'not-started', 
      progress: 0,
      topics: [
        "SVG հիմունքներ",
        "Վեկտորային օբյեկտների կառուցում",
        "Տեքստի և գրաֆիկայի համադրում",
        "Անիմացիաներ և փոխազդեցություններ"
      ]
    },
    { 
      id: 11, 
      title: "Կետային գրաֆիկա", 
      icon: Image, 
      status: 'not-started', 
      progress: 0,
      topics: [
        "Նկարների խմբագրում",
        "Ֆիլտրեր և էֆեկտներ",
        "Շերտերի աշխատանք",
        "Լուսանկարների ռետուշավորում"
      ]
    },
    { 
      id: 12, 
      title: "Գրաֆիկական ինտերֆեյսի ծրագրավորում", 
      icon: Smartphone, 
      status: 'not-started', 
      progress: 0,
      topics: [
        "UI/UX սկզբունքներ",
        "Կոմپոնենտների նախագծում",
        "Թեմաների և ոճերի կառավարում",
        "Բազմապլատֆորմային ինտերֆեյսներ"
      ]
    },
    { 
      id: 13, 
      title: "Տեղեկատվության անվտանգություն", 
      icon: Shield, 
      status: 'not-started', 
      progress: 0,
      topics: [
        "Կրիպտոգրաֆիայի հիմունքներ",
        "Հաքերային հարձակումների տիպեր",
        "Անվտանգության թույլ կողմերի գտնում",
        "Պաշտպանական մեխանիզմներ"
      ]
    },
  ];

  const getIntroDescription = () => {
    return isAuthenticated 
      ? "Ուսումնասիրեք մեր մոդուլները հերթականությամբ՝ սկսած հիմնական ալգորիթմներից մինչև առաջադեմ ծրագրավորում" 
      : "Ուսումնական ծրագրի մոդուլները ներկայացնում են հիմնական առարկաները հերթականությամբ՝ սկսած հիմնական ալգորիթմներից մինչև առաջադեմ ծրագրավորում";
  };

  return (
    <div className="mt-12">
      <FadeIn delay="delay-100">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Ուսումնական մոդուլներ
        </h2>
      </FadeIn>
      
      <FadeIn delay="delay-200">
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          {getIntroDescription()}
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {educationalModules.map((module, index) => (
          <ModuleCard
            key={module.id}
            module={module}
            delay={`delay-${100 * (index % 5 + 1)}`}
            showProgress={isAuthenticated}
          />
        ))}
      </div>
      
      {!isAuthenticated && (
        <FadeIn delay="delay-300">
          <div className="text-center mt-4 mb-8">
            <p className="text-muted-foreground">
              Մուտք գործեք համակարգ՝ ուսումնական առաջընթացը տեսնելու համար
            </p>
          </div>
        </FadeIn>
      )}
    </div>
  );
};

export default ModulesInfographic;
