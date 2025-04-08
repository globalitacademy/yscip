
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { useAuth } from '@/contexts/AuthContext';
import { StaggeredContainer } from '@/components/LocalTransitions';
import ModuleCard from './ModuleCard';
import { educationalModules } from './modules';

export const ModulesInfographic: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  const getIntroDescription = () => {
    return isAuthenticated 
      ? "Ուսումնասիրեք մեր մոդուլները հերթականությամբ՝ սկսած հիմնական ալգորիթմներից մինչև առաջադեմ ծրագրավորում" 
      : "Ուսումնական ծրագրի մոդուլները ներկայացնում են հիմնական առարկաները հերթականությամբ՝ սկսած հիմնական ալգորիթմներից մինչև առաջադեմ ծրագրավորում";
  };

  return (
    <section className="py-8 md:py-12" id="modules">
      <div className="container mx-auto px-4">
        <FadeIn delay="delay-100">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-center text-foreground">
            Ուսումնական մոդուլներ
          </h2>
        </FadeIn>
        
        <FadeIn delay="delay-200">
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-6 md:mb-8">
            {getIntroDescription()}
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {educationalModules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              delay={`delay-${(index % 5) * 100}`}
              showProgress={isAuthenticated}
            />
          ))}
        </div>
        
        {!isAuthenticated && (
          <FadeIn delay="delay-300">
            <div className="text-center mt-6 md:mt-8">
              <p className="text-muted-foreground">
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
