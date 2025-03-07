
import React, { useEffect, useRef, useState } from 'react';

const BackgroundEffects: React.FC = () => {
  // Generate code symbols for the background
  const codeSymbols = ['{', '}', '()', '=>', '</>', '[];', 'if', '==', '!=', '&&', '||', '++', '--', '*', '/', '%', '+='];
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const networkCanvasRef = useRef<HTMLCanvasElement>(null);
  
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
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(var(--foreground), 0.1)';
        ctx.fill();
        
        // Mouse interaction - nodes within 150px of mouse move toward/away
        const dx = mousePosition.x - node.x;
        const dy = mousePosition.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          // Push nodes away from mouse
          const angle = Math.atan2(dy, dx);
          const force = (150 - distance) / 1500;
          node.vx -= Math.cos(angle) * force;
          node.vy -= Math.sin(angle) * force;
          
          // Draw connection to mouse
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mousePosition.x, mousePosition.y);
          ctx.strokeStyle = `rgba(var(--primary), ${0.2 - distance / 750})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
        
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
            ctx.strokeStyle = `rgba(var(--foreground), ${0.1 - distance2 / 1000})`;
            ctx.lineWidth = 0.3;
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
  }, [mousePosition]);
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTIxMjEiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaC00djFoNHYtMXptNiAwaC00djFoNHYtMXptLTEyIDBoLTR2MWg0di0xem0tNiAwaC00djFoNHYtMXptMTggMGgtNHYxaDR2LTF6bS0xMiAyaC00djFoNHYtMXptLTYgMGgtNHYxaDR2LTF6bTEyIDBoLTR2MWg0di0xem0tMTYtNGgtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
      
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
