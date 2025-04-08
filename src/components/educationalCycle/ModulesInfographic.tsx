
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { useAuth } from '@/contexts/AuthContext';
import { Code, FileText, Layers, Globe } from 'lucide-react';

export const ModulesInfographic: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  const getIntroDescription = () => {
    return isAuthenticated 
      ? "Ուսումնասիրեք մեր մոդուլները հերթականությամբ՝ սկսած հիմնական ալգորիթմներից մինչև առաջադեմ ծրագրավորում" 
      : "Ուսումնական ծրագրի մոդուլները ներկայացնում են հիմնական առարկաները հերթականությամբ՝ սկսած հիմնական ալգորիթմներից մինչև առաջադեմ ծրագրավորում";
  };

  const modules = [
    {
      number: "1.",
      title: "Ալգորիթմների տարրերի նկարագում",
      description: "Սեղմեք թեմաները տեսնելու համար",
      color: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-700",
      textColor: "text-blue-600 dark:text-blue-300",
      icon: Code
    },
    {
      number: "2.",
      title: "Ծրագրավորման հիմունքներ",
      description: "Սեղմեք թեմաները տեսնելու համար",
      color: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-700",
      textColor: "text-green-600 dark:text-green-300",
      icon: FileText
    },
    {
      number: "3.",
      title: "Օբյեկտ կողմնորոշված ծրագրավորում",
      description: "Սեղմեք թեմաները տեսնելու համար",
      color: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-700",
      textColor: "text-purple-600 dark:text-purple-300",
      icon: Layers
    },
    {
      number: "4.",
      title: "Համակարգչային ցանցեր",
      description: "Սեղմեք թեմաները տեսնելու համար",
      color: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-700",
      textColor: "text-orange-600 dark:text-orange-300",
      icon: Globe
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-gray-900/40" id="modules">
      <div className="container mx-auto px-4">
        <FadeIn delay="delay-100">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-center text-foreground dark:text-gray-100">
            Ուսումնական մոդուլներ
          </h2>
        </FadeIn>
        
        <FadeIn delay="delay-200">
          <p className="text-muted-foreground dark:text-gray-300 text-center max-w-2xl mx-auto mb-8 md:mb-12">
            {getIntroDescription()}
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {modules.map((module, index) => (
            <FadeIn key={index} delay={`delay-${(index % 4) * 100 + 100}`}>
              <div 
                className={`rounded-lg border ${module.borderColor} ${module.color} p-6 h-full flex flex-col items-center text-center transition-shadow hover:shadow-md`}
              >
                <div className={`w-16 h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-5 ${module.textColor}`}>
                  <module.icon size={32} />
                </div>
                
                <h3 className={`text-lg font-medium mb-1 ${module.textColor}`}>
                  {module.number}
                </h3>
                
                <h4 className="text-lg font-medium mb-4 text-foreground dark:text-gray-100">
                  {module.title}
                </h4>
                
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  {module.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
        
        {!isAuthenticated && (
          <FadeIn delay="delay-300">
            <div className="text-center mt-10">
              <p className="text-muted-foreground dark:text-gray-400">
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
