
import React from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { FadeIn, SlideUp, SlideDown } from './LocalTransitions';
import { Button } from './ui/button';

const Hero: React.FC = () => {
  const scrollToThemes = () => {
    const themesSection = document.getElementById('themes-section');
    if (themesSection) {
      themesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl opacity-60 animate-pulse" />
      <div className="absolute bottom-1/3 -right-1/4 w-96 h-96 rounded-full bg-primary/15 blur-3xl opacity-50 animate-pulse" />
      
      <div className="container px-4 mx-auto text-center z-10">
        <SlideDown delay="delay-100">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-accent text-accent-foreground mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            100 Ժամանակակից պրոեկտի թեմաներ
          </div>
        </SlideDown>
        
        <SlideDown delay="delay-200">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Բացահայտեք Ձեր հաջորդ
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">Ծրագրավորման պրոեկտը</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 rounded -z-10" />
            </span>
          </h1>
        </SlideDown>
        
        <SlideDown delay="delay-300">
          <p className="max-w-xl mx-auto text-lg md:text-xl text-muted-foreground mb-12">
            Դիտեք մեր ընտրված 100 ժամանակակից պրոեկտի թեմաները՝ բարդության գնահատականներով և իրականացման քայլերով։
          </p>
        </SlideDown>
        
        <FadeIn delay="delay-500">
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg"
              className="group bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              onClick={scrollToThemes}
            >
              <span className="mr-2">Ուսումնասիրել թեմաները</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              className="hover:bg-secondary/80 transition-all duration-300"
            >
              Ֆիլտրել ըստ կատեգորիայի
            </Button>
          </div>
        </FadeIn>
        
        <SlideUp delay="delay-700" className="mt-24">
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
