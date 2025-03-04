
import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/useInView';

interface AnimationProps {
  children: ReactNode;
  className?: string;
  delay?: string;
}

export const FadeIn: React.FC<AnimationProps> = ({ children, className, delay = 'delay-0' }) => {
  const [ref, isInView] = useInView();
  
  return (
    <div 
      ref={ref} 
      className={cn(
        'transition-opacity duration-700 ease-in-out',
        isInView ? 'opacity-100' : 'opacity-0',
        delay,
        className
      )}
    >
      {children}
    </div>
  );
};

export const SlideUp: React.FC<AnimationProps> = ({ children, className, delay = 'delay-0' }) => {
  const [ref, isInView] = useInView();
  
  return (
    <div 
      ref={ref} 
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
  const [ref, isInView] = useInView();
  
  return (
    <div 
      ref={ref} 
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
}

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({ 
  children, 
  className,
  staggerDelay = 100
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
      { threshold: 0.1 }
    );
    
    observer.observe(container);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return (
    <div ref={containerRef} className={className}>
      {React.Children.map(children, (child, index) => {
        return React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              style: {
                transitionDelay: isInView ? `${index * staggerDelay}ms` : '0ms',
              },
            })
          : child;
      })}
    </div>
  );
};
