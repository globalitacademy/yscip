
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-apple-ease',
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md border-b py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-medium flex items-center space-x-2 transition-transform hover:scale-[1.02]">
          <span className="bg-primary text-primary-foreground rounded-md p-1 transform -rotate-6">PΘ</span>
          <span>Պրոեկտների Թեմաներ</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Գլխավոր
          </Link>
          <Link to="/categories" className="text-sm font-medium hover:text-primary transition-colors">
            Կատեգորիաներ
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
            Մեր մասին
          </Link>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Որոնել թեմաներ..."
              className="w-40 lg:w-60 h-9 px-10 rounded-full bg-secondary text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          "absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b transition-all duration-300 ease-apple-ease",
          isMenuOpen ? "max-h-[300px] py-4 opacity-100" : "max-h-0 py-0 opacity-0 overflow-hidden"
        )}
      >
        <nav className="container px-4 mx-auto flex flex-col space-y-4">
          <Link 
            to="/" 
            className="text-base font-medium hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Գլխավոր
          </Link>
          <Link 
            to="/categories" 
            className="text-base font-medium hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Կատեգորիաներ
          </Link>
          <Link 
            to="/about" 
            className="text-base font-medium hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Մեր մասին
          </Link>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Որոնել թեմաներ..."
              className="w-full h-10 px-10 rounded-full bg-secondary text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
