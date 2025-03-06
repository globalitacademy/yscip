
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projectThemes } from '@/data/projectThemes';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/LocalTransitions';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ThemeGridProps {
  limit?: number;
  createdProjects?: any[];
}

const ThemeGrid: React.FC<ThemeGridProps> = ({ limit, createdProjects = [] }) => {
  const [displayLimit, setDisplayLimit] = useState(limit || 6);
  const { user } = useAuth();
  const [allProjects, setAllProjects] = useState([...projectThemes]);
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Extract unique categories from projects
  const categories = ["all", ...new Set(projectThemes.map(project => project.category))];
  
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
  
  // Filter projects by category
  const categoryFilteredProjects = activeCategory === "all" 
    ? filteredProjects 
    : filteredProjects.filter(project => project.category === activeCategory);
  
  const themes = categoryFilteredProjects.slice(0, displayLimit);
  
  const loadMore = () => {
    setDisplayLimit(prev => Math.min(prev + 6, categoryFilteredProjects.length));
  };
  
  const hasMore = displayLimit < categoryFilteredProjects.length;
  
  return (
    <div className="mt-12">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ծրագրերի թեմաներն ըստ կատեգորիաների</h2>
        <Tabs defaultValue="all">
          <div className="overflow-x-auto pb-2">
            <TabsList className="mb-6 h-auto p-1">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category}
                  value={category} 
                  onClick={() => {
                    setActiveCategory(category);
                    setDisplayLimit(limit || 6);
                  }}
                  className={`px-4 py-2 ${activeCategory === category ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  {category === "all" ? "Բոլորը" : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="bg-muted">
              {categoryFilteredProjects.length} նախագիծ
            </Badge>
            {user && (
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {user.role === 'student' ? 'Ուսանող' : user.role === 'instructor' ? 'Դասախոս' : 'Ադմինիստրատոր'}
              </Badge>
            )}
          </div>
        </Tabs>
      </div>

      <FadeIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {themes.map((theme) => (
          <ProjectCard
            key={theme.id}
            project={theme}
          />
        ))}
      </FadeIn>
      
      {themes.length === 0 && (
        <div className="text-center p-10 bg-muted rounded-lg">
          <p className="text-muted-foreground">Այս կատեգորիայում ծրագրեր չկան</p>
        </div>
      )}
      
      <div className="flex justify-center space-x-4 mt-8">
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
