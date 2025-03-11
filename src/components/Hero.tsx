
import React from 'react';
import HeroContent from './HeroContent';

const Hero: React.FC = () => {
  const scrollToThemes = () => {
    const themesSection = document.getElementById('themes-section');
    if (themesSection) {
      themesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background/80 to-background pointer-events-none" />
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl opacity-60 animate-pulse" />
      <div className="absolute bottom-1/3 -right-1/4 w-96 h-96 rounded-full bg-primary/15 blur-3xl opacity-50 animate-pulse" />
      
      <HeroContent scrollToThemes={scrollToThemes} />
    </section>
  );
};

export default Hero;
