
import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/useInView';

interface AnimationProps {
  children: ReactNode;
  className?: string;
  delay?: string;
}

export const FadeIn: React.FC<AnimationProps> = ({ children, className, delay = 'delay-0' }) => {
  const [elementRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  
  return (
    <div 
      ref={elementRef} 
      className={cn(
        'transition-all duration-700 ease-in-out',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        delay,
        className
      )}
    >
      {children}
    </div>
  );
};

export const SlideUp: React.FC<AnimationProps> = ({ children, className, delay = 'delay-0' }) => {
  const [elementRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  
  return (
    <div 
      ref={elementRef} 
      className={cn(
        'transition-all duration-700 ease-out',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
        delay,
        className
      )}
    >
      {children}
    </div>
  );
};

export const SlideDown: React.FC<AnimationProps> = ({ children, className, delay = 'delay-0' }) => {
  const [elementRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  
  return (
    <div 
      ref={elementRef} 
      className={cn(
        'transition-all duration-700 ease-out',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10',
        delay,
        className
      )}
    >
      {children}
    </div>
  );
};

interface StaggeredContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
}

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({ 
  children, 
  className = '',
  staggerDelay = 100,
  baseDelay = 0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(container);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    observer.observe(container);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return (
    <div ref={containerRef} className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        // Calculate delay class based on index
        const delayValue = baseDelay + (index * staggerDelay);
        const delayClass = `delay-${Math.min(delayValue, 1000)}` as 
          'delay-0' | 'delay-100' | 'delay-200' | 'delay-300' | 'delay-400' | 
          'delay-500' | 'delay-600' | 'delay-700' | 'delay-800' | 'delay-900' | 'delay-1000';
        
        return React.cloneElement(child, {
          ...child.props,
          delay: delayClass,
          key: index,
          style: {
            ...child.props.style,
            transitionDelay: isInView ? `${index * staggerDelay}ms` : '0ms',
          },
        });
      })}
    </div>
  );
};
