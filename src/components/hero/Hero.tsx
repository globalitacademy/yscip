
import React, { useEffect, useRef, useState } from 'react';
import CustomCursor from './CustomCursor';
import BackgroundEffects from './BackgroundEffects';
import HeroContent from './HeroContent';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);

  // Fetch categories from project themes
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Import the project themes dynamically
        const { projectThemes } = await import('@/data/projectThemes');
        // Extract unique categories
        const uniqueCategories = [...new Set(projectThemes.map(project => project.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    
    fetchCategories();
  }, []);

  // Enhanced mouse animation effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      // Update mouse position for custom cursor
      setMousePosition({ x: e.clientX, y: e.clientY });
      setCursorVisible(true);
      
      // Parallax effect calculation
      const rect = heroRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
      
      // Apply to blobs with variable speeds
      const blobs = heroRef.current.querySelectorAll('.blob');
      blobs.forEach((blob, index) => {
        const speed = (index + 1) * 15;
        const xFactor = mouseX * speed;
        const yFactor = mouseY * speed;
        (blob as HTMLElement).style.transform = `translate(${xFactor}px, ${yFactor}px)`;
      });
      
      // Apply to code particles
      const particles = heroRef.current.querySelectorAll('.code-particle');
      particles.forEach((particle, index) => {
        const particleSpeed = (index % 3 + 1) * 8;
        const xParticleFactor = mouseX * particleSpeed;
        const yParticleFactor = mouseY * particleSpeed;
        (particle as HTMLElement).style.transform = `translate(${-xParticleFactor}px, ${-yParticleFactor}px)`;
      });
    };
    
    // Hide cursor when mouse leaves
    const handleMouseLeave = () => {
      setCursorVisible(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    heroRef.current?.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      heroRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Function to scroll to themes section
  const scrollToThemes = () => {
    const themesSection = document.getElementById('themes-section');
    if (themesSection) {
      themesSection.scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      // If themes-section doesn't exist yet, wait for it to be created
      console.log("Themes section not found, scrolling to where it should be");
      // As a fallback, scroll down a reasonable amount
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };
  
  // Function to handle category filter
  const handleCategoryFilter = (category: string) => {
    const themesSection = document.getElementById('themes-section');
    if (themesSection) {
      themesSection.scrollIntoView({ behavior: 'smooth' });
      
      // Set URL search parameter for category filtering
      const url = new URL(window.location.href);
      url.searchParams.set('category', category);
      window.history.pushState({}, '', url);
      
      // Dispatch a custom event that ThemeGrid can listen for
      window.dispatchEvent(new CustomEvent('categoryChanged', { 
        detail: { category } 
      }));
    }
  };

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 bg-gradient-to-b from-background/20 to-background">
      <CustomCursor mousePosition={mousePosition} cursorVisible={cursorVisible} />
      <BackgroundEffects />
      <HeroContent scrollToThemes={scrollToThemes} />
    </section>
  );
};

export default Hero;
