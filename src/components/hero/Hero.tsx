
import React, { useRef, useState, useEffect } from 'react';
import CustomCursor from './CustomCursor';
import BackgroundEffects from './BackgroundEffects';
import HeroContent from './HeroContent';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [secondaryCursors, setSecondaryCursors] = useState([
    { x: 100, y: 100, color: 'red', visible: true },
    { x: 200, y: 200, color: 'blue', visible: true },
  ]);

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
      // Update primary mouse position for custom cursor
      setMousePosition({ x: e.clientX, y: e.clientY });
      setCursorVisible(true);
      
      // Update secondary cursors with slight delay for an interactive effect
      setSecondaryCursors(prev => [
        { ...prev[0], x: e.clientX - 50, y: e.clientY + 50, visible: true },
        { ...prev[1], x: e.clientX + 50, y: e.clientY - 30, visible: true },
      ]);
    };
    
    // Hide cursor when mouse leaves
    const handleMouseLeave = () => {
      setCursorVisible(false);
      setSecondaryCursors(prev => prev.map(cursor => ({ ...cursor, visible: false })));
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
      {/* Primary cursor (yellow) */}
      <CustomCursor 
        mousePosition={mousePosition} 
        cursorVisible={cursorVisible} 
        color="primary"
        tooltipText="Դուրդ եկա՞վ"
        showTooltip={true}
      />
      
      {/* Secondary cursors (red and blue) */}
      {secondaryCursors.map((cursor, index) => (
        <CustomCursor 
          key={index}
          mousePosition={{ x: cursor.x, y: cursor.y }} 
          cursorVisible={cursor.visible}
          color={cursor.color}
        />
      ))}
      
      <BackgroundEffects />
      <HeroContent scrollToThemes={scrollToThemes} />
    </section>
  );
};

export default Hero;
