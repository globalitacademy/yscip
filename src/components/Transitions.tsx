
import React, { ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

interface AnimatedElementProps {
  children: ReactNode;
  animation: 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in' | 'blur-in';
  delay?: 'delay-0' | 'delay-100' | 'delay-200' | 'delay-300' | 'delay-400' | 'delay-500' | 'delay-600' | 'delay-700' | 'delay-800' | 'delay-900' | 'delay-1000';
  className?: string;
  threshold?: number;
}

export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animation,
  delay = 'delay-0',
  className = '',
  threshold = 0.1
}) => {
  const [ref, isInView] = useInView({ threshold });

  return (
    <div
      ref={ref}
      className={cn(
        'animate-on-scroll',
        isInView ? `animate-${animation} ${delay}` : '',
        className
      )}
    >
      {children}
    </div>
  );
};

export const FadeIn: React.FC<Omit<AnimatedElementProps, 'animation'>> = (props) => (
  <AnimatedElement animation="fade-in" {...props} />
);

export const SlideUp: React.FC<Omit<AnimatedElementProps, 'animation'>> = (props) => (
  <AnimatedElement animation="slide-up" {...props} />
);

export const SlideDown: React.FC<Omit<AnimatedElementProps, 'animation'>> = (props) => (
  <AnimatedElement animation="slide-down" {...props} />
);

export const ScaleIn: React.FC<Omit<AnimatedElementProps, 'animation'>> = (props) => (
  <AnimatedElement animation="scale-in" {...props} />
);

export const BlurIn: React.FC<Omit<AnimatedElementProps, 'animation'>> = (props) => (
  <AnimatedElement animation="blur-in" {...props} />
);

export const StaggeredContainer: React.FC<{
  children: ReactNode;
  className?: string;
  baseDelay?: number;
  staggerDelay?: number;
}> = ({ 
  children, 
  className = '',
  baseDelay = 0,
  staggerDelay = 100
}) => {
  const childrenArray = React.Children.toArray(children);
  
  return (
    <div className={className}>
      {childrenArray.map((child, index) => {
        if (!React.isValidElement(child)) return child;
        
        const delayClass = `delay-${baseDelay + (index * staggerDelay)}` as 
          'delay-0' | 'delay-100' | 'delay-200' | 'delay-300' | 'delay-400' | 
          'delay-500' | 'delay-600' | 'delay-700' | 'delay-800' | 'delay-900' | 'delay-1000';
        
        return React.cloneElement(child, {
          ...child.props,
          delay: delayClass,
          key: index
        });
      })}
    </div>
  );
};
