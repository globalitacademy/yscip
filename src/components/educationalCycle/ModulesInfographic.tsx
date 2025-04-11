
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { useAuth } from '@/contexts/AuthContext';
import { Code, FileText, Layers, Globe, Brain, Database, Lock, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

export const ModulesInfographic: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  
  const getIntroDescription = () => {
    return isAuthenticated 
      ? "Ուսումնասիրեք մեր մոդուլները հերթականությամբ՝ սկսած հիմնական ալգորիթմներից մինչև առաջադեմ ծրագրավորում" 
      : "Ուսումնական ծրագրի մոդուլները ներկայացնում են հիմնական առարկաները հերթականությամբ՝ սկսած հիմնական ալգորիթմներից մինչև առաջադեմ ծրագրավորում";
  };

  const modules = [
    {
      id: 1,
      number: "1.",
      title: "Ալգորիթմների տարրերի նկարագում",
      description: "Սեղմեք թեմաները տեսնելու համար",
      color: theme === 'dark' ? "bg-blue-900/30" : "bg-blue-50",
      borderColor: theme === 'dark' ? "border-blue-700" : "border-blue-200",
      textColor: theme === 'dark' ? "text-blue-300" : "text-blue-600",
      icon: Code
    },
    {
      id: 2,
      number: "2.",
      title: "Ծրագրավորման հիմունքներ",
      description: "Սեղմեք թեմաները տեսնելու համար",
      color: theme === 'dark' ? "bg-green-900/30" : "bg-green-50",
      borderColor: theme === 'dark' ? "border-green-700" : "border-green-200",
      textColor: theme === 'dark' ? "text-green-300" : "text-green-600",
      icon: FileText
    },
    {
      id: 3,
      number: "3.",
      title: "Օբյեկտ կողմնորոշված ծրագրավորում",
      description: "Սեղմեք թեմաները տեսնելու համար",
      color: theme === 'dark' ? "bg-purple-900/30" : "bg-purple-50",
      borderColor: theme === 'dark' ? "border-purple-700" : "border-purple-200",
      textColor: theme === 'dark' ? "text-purple-300" : "text-purple-600",
      icon: Layers
    },
    {
      id: 4,
      number: "4.",
      title: "Համակարգչային ցանցեր",
      description: "Սեղմեք թեմաները տեսնելու համար",
      color: theme === 'dark' ? "bg-orange-900/30" : "bg-orange-50",
      borderColor: theme === 'dark' ? "border-orange-700" : "border-orange-200",
      textColor: theme === 'dark' ? "text-orange-300" : "text-orange-600",
      icon: Globe
    },
    {
      id: 5,
      number: "5.",
      title: "Արհեստական բանականություն",
      description: "Սեղմեք թեմաները տեսնելու համար",
      color: theme === 'dark' ? "bg-indigo-900/30" : "bg-indigo-50",
      borderColor: theme === 'dark' ? "border-indigo-700" : "border-indigo-200",
      textColor: theme === 'dark' ? "text-indigo-300" : "text-indigo-600",
      icon: Brain
    },
    {
      id: 6,
      number: "6.",
      title: "Տվյալների բազաներ",
      description: "Սեղմեք թեմաները տեսնելու համար",
      color: theme === 'dark' ? "bg-cyan-900/30" : "bg-cyan-50",
      borderColor: theme === 'dark' ? "border-cyan-700" : "border-cyan-200",
      textColor: theme === 'dark' ? "text-cyan-300" : "text-cyan-600",
      icon: Database
    },
    {
      id: 7,
      number: "7.",
      title: "Կիբեռանվտանգություն",
      description: "Սեղմեք թեմաները տեսնելու համար",
      color: theme === 'dark' ? "bg-red-900/30" : "bg-red-50",
      borderColor: theme === 'dark' ? "border-red-700" : "border-red-200",
      textColor: theme === 'dark' ? "text-red-300" : "text-red-600",
      icon: Lock
    },
    {
      id: 8,
      number: "8.",
      title: "Օգտագործողի ինտերֆեյսի դիզայն",
      description: "Սեղմեք թեմաները տեսնելու համար",
      color: theme === 'dark' ? "bg-pink-900/30" : "bg-pink-50",
      borderColor: theme === 'dark' ? "border-pink-700" : "border-pink-200",
      textColor: theme === 'dark' ? "text-pink-300" : "text-pink-600",
      icon: Palette
    }
  ];

  return (
    <section className={`py-12 md:py-16 ${theme === 'dark' ? 'bg-gray-900/40' : 'bg-white'} transition-colors duration-300`} id="modules">
      <div className="container mx-auto px-4">
        <FadeIn delay="delay-100">
          <h2 className={`text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-center ${theme === 'dark' ? 'text-gray-100' : 'text-foreground'}`}>
            Ուսումնական մոդուլներ
          </h2>
        </FadeIn>
        
        <FadeIn delay="delay-200">
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} text-center max-w-2xl mx-auto mb-8 md:mb-12`}>
            {getIntroDescription()}
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {modules.map((module, index) => (
            <FadeIn key={index} delay={`delay-${(index % 4) * 100 + 100}`}>
              <div 
                className={`rounded-lg border ${module.borderColor} ${module.color} p-6 h-full flex flex-col items-center text-center transition-shadow hover:shadow-md ${theme === 'dark' ? 'hover:shadow-gray-800' : 'hover:shadow-gray-200'}`}
              >
                <div className={`w-16 h-16 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} flex items-center justify-center mb-5 ${module.textColor}`}>
                  <module.icon size={32} />
                </div>
                
                <h3 className={`text-lg font-medium mb-1 ${module.textColor}`}>
                  {module.number}
                </h3>
                
                <h4 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-foreground'}`}>
                  {module.title}
                </h4>
                
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'} mb-6`}>
                  {module.description}
                </p>
                
                <div className="mt-auto">
                  <Button 
                    asChild
                    size="sm" 
                    variant="outline"
                    className={`${module.textColor} border-current ${
                      theme === 'dark' 
                        ? 'hover:bg-current/20 hover:text-gray-100' 
                        : 'hover:bg-current/10 hover:text-current'
                    } transition-colors`}
                  >
                    <Link to={`/module/${module.id}`}>
                      Սկսել ուսուցումը
                    </Link>
                  </Button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        
        {!isAuthenticated && (
          <FadeIn delay="delay-300">
            <div className="text-center mt-10">
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                Մուտք գործեք համակարգ՝ ուսումնական առաջընթացը տեսնելու համար
              </p>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
};

export default ModulesInfographic;
