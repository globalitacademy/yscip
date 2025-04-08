
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/hooks/use-theme';

const BackgroundEffects: React.FC = () => {
  // Generate code symbols for the background
  const codeSymbols = ['{', '}', '()', '=>', '</>', '[];', 'if', '==', '!=', '&&', '||', '++', '--', '*', '/', '%', '+='];
  const networkCanvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  // Network animation effect
  useEffect(() => {
    const canvas = networkCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateCanvasSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initialize canvas size
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Create network nodes
    const nodes: { x: number, y: number, vx: number, vy: number, radius: number }[] = [];
    const nodeCount = Math.floor(window.innerWidth * window.innerHeight / 25000); // Adjust density
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 1
      });
    }
    
    // Animation function
    const animate = () => {
      if (!canvas || !ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        
        // Boundary check
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Draw node with appropriate opacity based on theme
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        // Use higher opacity in both modes for better visibility
        ctx.fillStyle = theme === 'dark' 
          ? 'rgba(255, 255, 255, 0.3)' 
          : 'rgba(0, 0, 0, 0.25)';
        ctx.fill();
        
        // Connect nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const node2 = nodes[j];
          const dx2 = node.x - node2.x;
          const dy2 = node.y - node2.y;
          const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          
          if (distance2 < 100) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node2.x, node2.y);
            // Use higher opacity in both modes for connections too
            ctx.strokeStyle = theme === 'dark'
              ? `rgba(255, 255, 255, ${0.25 - distance2 / 1000})`
              : `rgba(0, 0, 0, ${0.2 - distance2 / 1000})`;
            ctx.lineWidth = theme === 'dark' ? 0.5 : 0.6;
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [theme]);

  return (
    <>
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
      
      {/* Network canvas for interactive animation */}
      <canvas
        ref={networkCanvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />
      
      {/* Subtle grid pattern overlay with reduced opacity */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTIxMjEiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaC00djFoNHYtMXptNiAwaC00djFoNHYtMXptLTEyIDBoLTR2MWg0di0xem0tNiAwaC00djFoNHYtMXptMTggMGgtNHYxaDR2LTF6bS0xMiAyaC00djFoNHYtMXptLTYgMGgtNHYxaDR2LTF6bTEyIDBoLTR2MWg0di0xem0tMTYtNGgtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20 cursor-none" />
      
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
    </>
  );
};

export default BackgroundEffects;
