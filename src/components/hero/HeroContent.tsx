import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FadeIn, SlideDown, SlideUp } from '../LocalTransitions';
interface HeroContentProps {
  scrollToThemes: () => void;
}
const HeroContent: React.FC<HeroContentProps> = ({
  scrollToThemes
}) => {
  return <div className="container px-4 mx-auto text-center z-10">
      <SlideDown delay="delay-100">
        <div className="inline-block px-4 py-1 mb-6 rounded-full text-sm font-medium bg-gradient-to-r from-accent to-accent/70 text-accent-foreground backdrop-blur-sm border border-accent/20 transform hover:scale-105 transition-transform duration-300">
          Ուսուցման կառավարման վեբ-հարթակ
        </div>
      </SlideDown>
      
      <SlideDown delay="delay-200">
        <h1 className="md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight text-base xl:text-5xl">
          <span className="relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 text-4xl font-semibold">Սկսիր մասնագիտական ուղիդ</span>
          <br />
          <span className="relative inline-block mt-2">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/70">Ուսուցում առանց 
սահմանների</span>
            <span className="absolute bottom-1 left-0 w-full h-4 bg-primary/20 rounded-full -z-10 blur-[2px] transform skew-x-12"></span>
          </span>
        </h1>
      </SlideDown>
      
      <SlideDown delay="delay-300">
        <p className="max-w-xl mx-auto md:text-xl text-muted-foreground mb-12 tracking-wide text-xs">Հարթակը միավորում է ուսանողներին, դասախոսներին և գործատուներին՝ ստեղծելով կրթության նոր ճանապարհ, որը հարմարեցված է ձեր կարիքներին։</p>
      </SlideDown>
      
      <FadeIn delay="delay-500">
        <div className="flex flex-wrap justify-center gap-6">
          <button className="px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:translate-y-[-4px] transition-all duration-300 backdrop-blur-sm border border-primary/20 relative overflow-hidden group" onClick={scrollToThemes} aria-label="Explore themes">
            <span className="relative z-10">Ուսումնասիրել թեմաները</span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-full transition-all duration-1000 ease-in-out"></span>
          </button>
        </div>
      </FadeIn>
      
      <SlideUp delay="delay-700" className="mt-24">
        <button onClick={scrollToThemes} className="inline-flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors group" aria-label="Scroll down">
          <span className="text-sm mb-2 group-hover:translate-y-1 transition-transform">Ոլորել դեպի ներքև</span>
          <ChevronDown size={22} className="animate-bounce group-hover:animate-none group-hover:scale-125 transition-transform" />
        </button>
      </SlideUp>
    </div>;
};
export default HeroContent;