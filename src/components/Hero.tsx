
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FadeIn, SlideUp, SlideDown } from './LocalTransitions';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<string[]>([]);

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

  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      const moveX = mouseX * 20 - 10;
      const moveY = mouseY * 20 - 10;
      const blobs = heroRef.current.querySelectorAll('.blob');
      blobs.forEach((blob, index) => {
        const factor = (index + 1) * 0.2;
        (blob as HTMLElement).style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Function to scroll to themes section
  const scrollToThemes = () => {
    const themesSection = document.getElementById('themes-section');
    if (themesSection) {
      themesSection.scrollIntoView({
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

  return <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 bg-gradient-to-b from-background/20 to-background">
      {/* Modern colorful blobs/shapes */}
      <div className="blob absolute top-[20%] left-[15%] w-72 h-72 rounded-full bg-primary/10 blur-[80px] opacity-70 mix-blend-multiply" />
      <div className="blob absolute bottom-[25%] right-[15%] w-96 h-96 rounded-full bg-accent/20 blur-[100px] opacity-60 mix-blend-multiply" />
      <div className="blob absolute top-[40%] right-[30%] w-64 h-64 rounded-full bg-secondary/15 blur-[70px] opacity-50 mix-blend-multiply" />
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTIxMjEiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaC00djFoNHYtMXptNiAwaC00djFoNHYtMXptLTEyIDBoLTR2MWg0di0xem0tNiAwaC00djFoNHYtMXptMTggMGgtNHYxaDR2LTF6bS0xMiAyaC00djFoNHYtMXptLTYgMGgtNHYxaDR2LTF6bTEyIDBoLTR2MWg0di0xem0tMTYtNGgtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
      
      <div className="container px-4 mx-auto text-center z-10">
        <SlideDown delay="delay-100">
          <div className="inline-block px-4 py-1 mb-6 rounded-full text-sm font-medium bg-gradient-to-r from-accent to-accent/70 text-accent-foreground backdrop-blur-sm border border-accent/20">
            100 Ժամանակակից պրոեկտի թեմաներ
          </div>
        </SlideDown>
        
        <SlideDown delay="delay-200">
          <h1 className="md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 text-base xl:text-5xl">
            Սկսիր քո մասնագիտական ուղին
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">Ծրագրավորման պրոեկտը</span>
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
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm border border-primary/20"
              onClick={scrollToThemes}
              aria-label="Explore themes"
            >
              Ուսումնասիրել թեմաները
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
      
      {/* Animated floating dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-primary/30" style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: 0.1 + Math.random() * 0.5
      }} />)}
      </div>
    </section>;
};

export default Hero;
