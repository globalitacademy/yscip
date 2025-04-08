
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { useAuth } from '@/contexts/AuthContext';
import ModuleCard from './ModuleCard';
import { educationalModules } from './moduleData';

export const ModulesInfographic: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  const getIntroDescription = () => {
    return isAuthenticated 
      ? "Ուսումնասիրեք մեր մոդուլները հերթականությամբ՝ սկսած հիմնական ալգորիթմներից մինչև առաջադեմ ծրագրավորում" 
      : "Ուսումնական ծրագրի մոդուլները ներկայացնում են հիմնական առարկաները հերթականությամբ՝ սկսած հիմնական ալգորիթմներից մինչև առաջադեմ ծրագրավորում";
  };

  return (
    <div className="container mx-auto px-4 mt-12">
      <FadeIn delay="delay-100">
        <h2 className="text-3xl font-bold mb-4 text-center text-foreground">
          Ուսումնական մոդուլներ
        </h2>
      </FadeIn>
      
      <FadeIn delay="delay-200">
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          {getIntroDescription()}
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
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
