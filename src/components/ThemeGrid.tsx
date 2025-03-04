
import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import { projectThemes, getMoreProjects, ProjectTheme } from '@/data/projectThemes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { StaggeredContainer, SlideUp } from './LocalTransitions';

const allCategories = ['Բոլորը', ...new Set(projectThemes.map(project => project.category))];
const complexityLevels = ['Բոլորը', 'Սկսնակ', 'Միջին', 'Առաջադեմ'];

const ThemeGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Բոլորը');
  const [activeComplexity, setActiveComplexity] = useState('Բոլորը');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(12);
  
  const allProjects = getMoreProjects();
  
  // Filter projects based on active filters
  const filteredProjects = allProjects.filter(project => {
    const matchesCategory = activeCategory === 'Բոլորը' || project.category === activeCategory;
    const matchesComplexity = activeComplexity === 'Բոլորը' || project.complexity === activeComplexity;
    return matchesCategory && matchesComplexity;
  });
  
  const displayedProjects = filteredProjects.slice(0, visibleProjects);
  
  const loadMore = () => {
    setVisibleProjects(prev => Math.min(prev + 12, filteredProjects.length));
  };

  return (
    <div className="py-16" id="themes-section">
      <div className="container px-4 mx-auto">
        <SlideUp>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Դիտել պրոեկտի թեմաները <span className="text-primary">({filteredProjects.length})</span>
            </h2>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 self-start md:self-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Ֆիլտրեր
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        </SlideUp>
        
        {/* Filters */}
        <div className={`mb-8 grid gap-6 ${showFilters ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} transition-all duration-300`}>
          <div className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 pb-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Ֆիլտրել ըստ կատեգորիայի</h3>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((category) => (
                    <Badge
                      key={category}
                      variant={activeCategory === category ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Ֆիլտրել ըստ բարդության</h3>
                <div className="flex flex-wrap gap-2">
                  {complexityLevels.map((level) => (
                    <Badge
                      key={level}
                      variant={activeComplexity === level ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setActiveComplexity(level)}
                    >
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Projects Grid */}
        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayedProjects.map((project, index) => (
            <SlideUp key={project.id} className="h-full">
              <ProjectCard project={project} className="h-full" />
            </SlideUp>
          ))}
        </StaggeredContainer>
        
        {/* Load More Button */}
        {displayedProjects.length < filteredProjects.length && (
          <div className="flex justify-center mt-12">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={loadMore}
              className="px-8 border-primary/30 hover:bg-primary/5"
            >
              Բեռնել ավելի շատ պրոեկտներ
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeGrid;
