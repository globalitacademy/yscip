
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FadeIn, SlideUp, SlideDown } from './LocalTransitions';

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

  // Generate code symbols for the background
  const codeSymbols = ['{', '}', '()', '=>', '</>', '[];', 'if', '==', '!=', '&&', '||', '++', '--', '*', '/', '%', '+='];

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 bg-gradient-to-b from-background/20 to-background">
      {/* Custom cursor following mouse */}
      <div 
        className={`fixed w-8 h-8 rounded-full bg-primary/20 mix-blend-plus-lighter pointer-events-none z-50 transition-opacity duration-300 backdrop-blur-sm ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px 5px rgba(var(--primary), 0.2)'
        }}
      />
      
      {/* Modern colorful blobs/shapes with enhanced effects */}
      <div className="blob absolute top-[20%] left-[15%] w-72 h-72 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-[80px] opacity-70 mix-blend-multiply transition-transform duration-700" />
      <div className="blob absolute bottom-[25%] right-[15%] w-96 h-96 rounded-full bg-gradient-to-bl from-accent/30 to-accent/10 blur-[100px] opacity-60 mix-blend-multiply transition-transform duration-700" />
      <div className="blob absolute top-[40%] right-[30%] w-64 h-64 rounded-full bg-gradient-to-tr from-secondary/25 to-secondary/5 blur-[70px] opacity-50 mix-blend-multiply transition-transform duration-700" />
      
      {/* Code particles background */}
      {codeSymbols.map((symbol, i) => (
        <div 
          key={i}
          className="code-particle absolute text-foreground/10 font-mono transition-transform duration-500 select-none"
          style={{
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 90}%`,
            fontSize: `${Math.random() * 16 + 10}px`,
            opacity: Math.random() * 0.5 + 0.1,
            transform: `rotate(${Math.random() * 40 - 20}deg)`,
            zIndex: 1
          }}
        >
          {symbol}
        </div>
      ))}
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTIxMjEiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaC00djFoNHYtMXptNiAwaC00djFoNHYtMXptLTEyIDBoLTR2MWg0di0xem0tNiAwaC00djFoNHYtMXptMTggMGgtNHYxaDR2LTF6bS0xMiAyaC00djFoNHYtMXptLTYgMGgtNHYxaDR2LTF6bTEyIDBoLTR2MWg0di0xem0tMTYtNGgtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
      
      <div className="container px-4 mx-auto text-center z-10">
        <SlideDown delay="delay-100">
          <div className="inline-block px-4 py-1 mb-6 rounded-full text-sm font-medium bg-gradient-to-r from-accent to-accent/70 text-accent-foreground backdrop-blur-sm border border-accent/20 transform hover:scale-105 transition-transform duration-300">
            100 Ժամանակակից պրոեկտի թեմաներ
          </div>
        </SlideDown>
        
        <SlideDown delay="delay-200">
          <h1 className="md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight text-base xl:text-5xl">
            <span className="relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70">
              Սկսիր քո մասնագիտական ուղին
            </span>
            <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/70">Ծրագրավորման պրոեկտը</span>
              <span className="absolute bottom-1 left-0 w-full h-4 bg-primary/20 rounded-full -z-10 blur-[2px] transform skew-x-12"></span>
            </span>
          </h1>
        </SlideDown>
        
        <SlideDown delay="delay-300">
          <p className="max-w-xl mx-auto text-lg md:text-xl text-muted-foreground mb-12 tracking-wide">
            Դիտեք մեր ընտրված 100 ժամանակակից պրոեկտի թեմաները՝ բարդության գնահատականներով և իրականացման քայլերով։
          </p>
        </SlideDown>
        
        <FadeIn delay="delay-500">
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:translate-y-[-4px] transition-all duration-300 backdrop-blur-sm border border-primary/20 relative overflow-hidden group"
              onClick={scrollToThemes}
              aria-label="Explore themes"
            >
              <span className="relative z-10">Ուսումնասիրել թեմաները</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-full transition-all duration-1000 ease-in-out"></span>
            </button>
          </div>
        </FadeIn>
        
        <SlideUp delay="delay-700" className="mt-24">
          <button 
            onClick={scrollToThemes} 
            className="inline-flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors group"
            aria-label="Scroll down"
          >
            <span className="text-sm mb-2 group-hover:translate-y-1 transition-transform">Ոլորել դեպի ներքև</span>
            <ChevronDown size={22} className="animate-bounce group-hover:animate-none group-hover:scale-125 transition-transform" />
          </button>
        </SlideUp>
      </div>
      
      {/* Animated floating dots with improved behavior */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full" 
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              background: i % 3 === 0 ? 'var(--primary)' : i % 3 === 1 ? 'var(--secondary)' : 'var(--accent)',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.1 + Math.random() * 0.5,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              boxShadow: i % 5 === 0 ? '0 0 10px 2px rgba(var(--primary), 0.1)' : 'none'
            }} 
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
