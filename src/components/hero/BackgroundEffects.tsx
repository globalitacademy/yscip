
import React from 'react';

const BackgroundEffects: React.FC = () => {
  // Generate code symbols for the background
  const codeSymbols = ['{', '}', '()', '=>', '</>', '[];', 'if', '==', '!=', '&&', '||', '++', '--', '*', '/', '%', '+='];

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
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTIxMjEiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaC00djFoNHYtMXptNiAwaC00djFoNHYtMXptLTEyIDBoLTR2MWg0di0xem0tNiAwaC00djFoNHYtMXptMTggMGgtNHYxaDR2LTF6bS0xMiAyaC00djFoNHYtMXptLTYgMGgtNHYxaDR2LTF6bTEyIDBoLTR2MWg0di0xem0tMTYtNGgtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
      
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
