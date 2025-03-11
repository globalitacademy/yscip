
import React from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { FadeIn, SlideDown, SlideUp } from './LocalTransitions';
import { Button } from './ui/button';

interface HeroContentProps {
  scrollToThemes: () => void;
}

const HeroContent: React.FC<HeroContentProps> = ({ scrollToThemes }) => {
  return (
    <div className="container px-4 mx-auto text-center z-10">
      <SlideDown delay="delay-100">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-accent text-accent-foreground mb-6 md:mb-8">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="line-clamp-1">100 Ժամանակակից պրոեկտի թեմաներ</span>
        </div>
      </SlideDown>
      
      <SlideDown delay="delay-200">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight tracking-tight">
          <span className="block sm:inline">Բացահայտեք Ձեր</span>{' '}
          <span className="relative inline-block">
            <span className="relative z-10">Ծրագրավորման պրոեկտը</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 rounded -z-10" />
          </span>
        </h1>
      </SlideDown>
      
      <SlideDown delay="delay-300">
        <p className="max-w-xl mx-auto text-base md:text-lg lg:text-xl text-muted-foreground mb-8 md:mb-12">
          Դիտեք մեր ընտրված 100 ժամանակակից պրոեկտի թեմաները՝ բարդության գնահատականներով և իրականացման քայլերով։
        </p>
      </SlideDown>
      
      <FadeIn delay="delay-500">
        <div className="flex flex-col sm:flex-row justify-center gap-4 mx-auto max-w-md sm:max-w-none">
          <Button 
            size="lg"
            className="group bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 w-full sm:w-auto"
            onClick={scrollToThemes}
          >
            <span className="mr-2">Ուսումնասիրել թեմաները</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            className="hover:bg-secondary/80 transition-all duration-300 w-full sm:w-auto"
          >
            Ֆիլտրել ըստ կատեգորիայի
          </Button>
        </div>
      </FadeIn>
      
      <SlideUp delay="delay-700" className="mt-16 md:mt-24 hidden md:block">
        <button 
          onClick={scrollToThemes}
          className="inline-flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Ոլորել դեպի ներքև"
        >
          <span className="text-sm mb-2">Ոլորել դեպի ներքև</span>
          <ChevronDown size={20} className="animate-bounce" />
        </button>
      </SlideUp>
    </div>
  );
};

export default HeroContent;
