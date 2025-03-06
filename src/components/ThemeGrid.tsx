
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projectThemes } from '@/data/projectThemes';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/LocalTransitions';

interface ThemeGridProps {
  limit?: number;
}

const ThemeGrid: React.FC<ThemeGridProps> = ({ limit }) => {
  const [displayLimit, setDisplayLimit] = useState(limit || 6);
  const themes = projectThemes.slice(0, displayLimit);
  
  const loadMore = () => {
    setDisplayLimit(prev => Math.min(prev + 6, projectThemes.length));
  };
  
  const hasMore = displayLimit < projectThemes.length;
  
  return (
    <div className="mt-12">
      <FadeIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {themes.map((theme) => (
          <ProjectCard
            key={theme.id}
            id={theme.id}
            title={theme.title}
            description={theme.description}
            category={theme.category}
            complexity={theme.complexity}
            techStack={theme.techStack}
            image={theme.image}
          />
        ))}
      </FadeIn>
      
      <div className="flex justify-center space-x-4">
        {hasMore && (
          <Button onClick={loadMore} variant="outline" size="lg">
            Տեսնել ավելին
          </Button>
        )}
        
        <Link to="/">
          <Button variant="default" size="lg" className="group">
            Բոլոր թեմաները
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ThemeGrid;
