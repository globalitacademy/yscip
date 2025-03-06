
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projectThemes } from '@/data/projectThemes';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/LocalTransitions';
import { useAuth } from '@/contexts/AuthContext';

interface ThemeGridProps {
  limit?: number;
  createdProjects?: any[];
}

const ThemeGrid: React.FC<ThemeGridProps> = ({ limit, createdProjects = [] }) => {
  const [displayLimit, setDisplayLimit] = useState(limit || 6);
  const { user } = useAuth();
  const [allProjects, setAllProjects] = useState([...projectThemes]);
  
  // Merge projectThemes with createdProjects when component mounts or createdProjects changes
  useEffect(() => {
    if (createdProjects && createdProjects.length > 0) {
      // Convert project themes to ensure consistent format
      const formattedCreatedProjects = createdProjects.map(project => ({
        ...project,
        id: project.id || Date.now() + Math.random(), // Ensure unique ID
        complexity: project.complexity || 'Միջին',
        techStack: project.techStack || [],
        steps: project.steps || [],
        category: project.category || 'Այլ',
      }));
      
      // Merge arrays, avoiding duplicates by ID
      const mergedProjects = [...projectThemes];
      
      formattedCreatedProjects.forEach(newProject => {
        const existingIndex = mergedProjects.findIndex(p => p.id === newProject.id);
        if (existingIndex >= 0) {
          mergedProjects[existingIndex] = newProject;
        } else {
          mergedProjects.push(newProject);
        }
      });
      
      setAllProjects(mergedProjects);
    }
  }, [createdProjects]);
  
  // Filter projects based on user role if needed
  const filteredProjects = user?.role === 'instructor' && user?.assignedProjects
    ? allProjects.filter(project => user.assignedProjects?.includes(project.id))
    : allProjects;
  
  const themes = filteredProjects.slice(0, displayLimit);
  
  const loadMore = () => {
    setDisplayLimit(prev => Math.min(prev + 6, filteredProjects.length));
  };
  
  const hasMore = displayLimit < filteredProjects.length;
  
  return (
    <div className="mt-12">
      <FadeIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {themes.map((theme) => (
          <ProjectCard
            key={theme.id}
            project={theme}
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
