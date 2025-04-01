
import React, { useRef, useState, useEffect } from 'react';
import CustomCursor from './CustomCursor';
import BackgroundEffects from './BackgroundEffects';
import HeroContent from './HeroContent';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [containerBounds, setContainerBounds] = useState({ top: 0, left: 0, width: 0, height: 0 });
  
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

  // Measure container to position static cursors and constrain cursor movement
  useEffect(() => {
    const updateContainerBounds = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerBounds({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      }
    };
    
    updateContainerBounds();
    
    // Add a small delay to ensure proper measurement after layout
    const timeoutId = setTimeout(updateContainerBounds, 300);
    
    window.addEventListener('resize', updateContainerBounds);
    window.addEventListener('scroll', updateContainerBounds);
    
    return () => {
      window.removeEventListener('resize', updateContainerBounds);
      window.removeEventListener('scroll', updateContainerBounds);
      clearTimeout(timeoutId);
    };
  }, []);

  // Custom cursor tracking with smooth damping effect
  useEffect(() => {
    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Only update cursor if mouse is within container bounds
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isInContainer = 
          e.clientX >= rect.left && 
          e.clientX <= rect.left + rect.width && 
          e.clientY >= rect.top && 
          e.clientY <= rect.top + rect.height;
        
        if (isInContainer) {
          targetX = e.clientX;
          targetY = e.clientY;
          
          if (!cursorVisible) {
            setCursorVisible(true);
          }
        } else {
          setCursorVisible(false);
        }
      }
    };
    
    const animateCursor = () => {
      // Simple damping animation
      const ease = 0.2;
      
      currentX = currentX + (targetX - currentX) * ease;
      currentY = currentY + (targetY - currentY) * ease;
      
      setMousePosition({ x: currentX, y: currentY });
      
      animationFrameId = requestAnimationFrame(animateCursor);
    };
    
    // Start the animation
    animationFrameId = requestAnimationFrame(animateCursor);
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [cursorVisible]);

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

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 bg-gradient-to-b from-background/20 to-background">
      {/* Simple triangular cursor that follows mouse */}
      <CustomCursor 
        mousePosition={mousePosition}
        cursorVisible={cursorVisible}
        color="yellow"
      />
      
      <BackgroundEffects />
      <div 
        ref={containerRef} 
        className="relative w-full cursor-none"
      >
        <HeroContent scrollToThemes={scrollToThemes} />
      </div>
    </section>
  );
};

export default Hero;
