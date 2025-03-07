
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FadeIn, SlideUp, SlideDown } from './LocalTransitions';

const Hero: React.FC = () => {
  const scrollToThemes = () => {
    const themesSection = document.getElementById('themes-section');
    if (themesSection) {
      themesSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If themes section not found, scroll down 100vh
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden pt-8 sm:pt-16">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      {/* Abstract shapes - blur circles */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full bg-primary/10 blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 rounded-full bg-primary/15 blur-3xl opacity-50 animate-pulse" style={{ animationDuration: '12s' }} />
      
      <div className="container px-4 mx-auto text-center z-10">
        <SlideDown delay="delay-100">
          <p className="inline-block px-4 py-1 mb-4 sm:mb-6 rounded-full text-xs sm:text-sm font-medium bg-accent text-accent-foreground">
            100 Ժամանակակից պրոեկտի թեմաներ
          </p>
        </SlideDown>
        
        <SlideDown delay="delay-200">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight">
            Բացահայտեք Ձեր հաջորդ
            <br className="hidden sm:block" />
            <span className="relative inline-block">
              <span className="relative z-10">Ծրագրավորման պրոեկտը</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 rounded -z-10"></span>
            </span>
          </h1>
        </SlideDown>
        
        <SlideDown delay="delay-300">
          <p className="max-w-xl mx-auto text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-10 px-4">
            Դիտեք մեր ընտրված 100 ժամանակակից պրոեկտի թեմաները՝ բարդության գնահատականներով և իրականացման քայլերով։
          </p>
        </SlideDown>
        
        <FadeIn delay="delay-500">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <button 
              className="px-4 sm:px-8 py-2 sm:py-3 bg-primary text-primary-foreground text-sm sm:text-base font-medium rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-1 transition-all duration-300"
              onClick={scrollToThemes}
            >
              Ուսումնասիրել թեմաները
            </button>
            <button className="px-4 sm:px-8 py-2 sm:py-3 bg-secondary text-secondary-foreground text-sm sm:text-base font-medium rounded-lg hover:bg-secondary/80 transition-all duration-300">
              Ֆիլտրել ըստ կատեգորիայի
            </button>
          </div>
        </FadeIn>
        
        <SlideUp delay="delay-700" className="mt-10 sm:mt-16 md:mt-20">
          <button 
            onClick={scrollToThemes}
            className="inline-flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-xs sm:text-sm mb-2">Ոլորել դեպի ներքև</span>
            <ChevronDown size={16} className="animate-bounce sm:size-20" />
          </button>
        </SlideUp>
      </div>
    </section>
  );
};

export default Hero;
