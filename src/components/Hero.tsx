
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FadeIn, SlideUp, SlideDown } from './LocalTransitions';

const Hero: React.FC = () => {
  const scrollToThemes = () => {
    const themesSection = document.getElementById('themes-section');
    if (themesSection) {
      themesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      {/* Abstract shapes - blur circles */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-primary/15 blur-3xl opacity-50 animate-pulse" style={{ animationDuration: '12s' }} />
      
      <div className="container px-4 mx-auto text-center z-10">
        <SlideDown delay="delay-100">
          <p className="inline-block px-4 py-1 mb-6 rounded-full text-sm font-medium bg-accent text-accent-foreground">
            100 Ժամանակակից պրոեկտի թեմաներ
          </p>
        </SlideDown>
        
        <SlideDown delay="delay-200">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Բացահայտեք Ձեր հաջորդ
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">Ծրագրավորման պրոեկտը</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 rounded -z-10"></span>
            </span>
          </h1>
        </SlideDown>
        
        <SlideDown delay="delay-300">
          <p className="max-w-xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
            Դիտեք մեր ընտրված 100 ժամանակակից պրոեկտի թեմաները՝ բարդության գնահատականներով և իրականացման քայլերով։
          </p>
        </SlideDown>
        
        <FadeIn delay="delay-500">
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-1 transition-all duration-300"
              onClick={scrollToThemes}
            >
              Ուսումնասիրել թեմաները
            </button>
            <button className="px-8 py-3 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-all duration-300">
              Ֆիլտրել ըստ կատեգորիայի
            </button>
          </div>
        </FadeIn>
        
        <SlideUp delay="delay-700" className="mt-20">
          <button 
            onClick={scrollToThemes}
            className="inline-flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-sm mb-2">Ոլորել դեպի ներքև</span>
            <ChevronDown size={20} className="animate-bounce" />
          </button>
        </SlideUp>
      </div>
    </section>
  );
};

export default Hero;
