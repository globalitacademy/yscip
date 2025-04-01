
import React, { useRef, useState, useEffect } from 'react';
import CustomCursor from './CustomCursor';
import BackgroundEffects from './BackgroundEffects';
import HeroContent from './HeroContent';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  
  // Cursor configurations
  const cursors = [
    { name: "Արման", color: "green", direction: "top-left" as const, offset: { x: -70, y: -70 } },
    { name: "Կարեն", color: "purple", direction: "top-right" as const, offset: { x: 70, y: -70 } },
    { name: "Մարիամ", color: "red", direction: "bottom-left" as const, offset: { x: -70, y: 70 } },
    { name: "Անահիտ", color: "blue", direction: "bottom-right" as const, offset: { x: 70, y: 70 } },
  ];

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

  // Custom cursor tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setCursorVisible(true);
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

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 bg-gradient-to-b from-background/20 to-background">
      {/* Render all cursors with their respective offsets */}
      {cursors.map((cursor, index) => (
        <CustomCursor 
          key={index}
          mousePosition={{ 
            x: mousePosition.x + cursor.offset.x, 
            y: mousePosition.y + cursor.offset.y 
          }} 
          cursorVisible={cursorVisible}
          color={cursor.color}
          name={cursor.name}
          direction={cursor.direction}
        />
      ))}
      
      <BackgroundEffects />
      <HeroContent scrollToThemes={scrollToThemes} />
    </section>
  );
};

export default Hero;
