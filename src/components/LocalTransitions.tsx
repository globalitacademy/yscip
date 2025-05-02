
import React from 'react';
import { motion } from 'framer-motion';

interface TransitionProps {
  children: React.ReactNode;
  className?: string;
  delay?: string; // Added delay prop
}

export const FadeIn: React.FC<TransitionProps> = ({ children, className, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: delay ? Number(delay.replace('delay-', '')) / 1000 : 0 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SlideUp: React.FC<TransitionProps> = ({ children, className, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: delay ? Number(delay.replace('delay-', '')) / 1000 : 0 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SlideDown: React.FC<TransitionProps> = ({ children, className, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: delay ? Number(delay.replace('delay-', '')) / 1000 : 0 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SlideIn: React.FC<TransitionProps> = ({ children, className, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: delay ? Number(delay.replace('delay-', '')) / 1000 : 0 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn: React.FC<TransitionProps> = ({ children, className, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: delay ? Number(delay.replace('delay-', '')) / 1000 : 0 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
