
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// Extract unique categories from project themes
export const getUniqueCategories = (projects: any[]) => {
  const categories = projects.map(project => project.category);
  return Array.from(new Set(categories)).sort();
};

interface ProjectCategoriesProps {
  projects: any[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const ProjectCategories: React.FC<ProjectCategoriesProps> = ({
  projects,
  selectedCategory,
  onCategoryChange,
}) => {
  const categories = getUniqueCategories(projects);

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2">Կատեգորիաներ</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-1">
          <Badge
            onClick={() => onCategoryChange(null)}
            className={`cursor-pointer hover:bg-primary/80 ${
              selectedCategory === null ? 'bg-primary' : 'bg-secondary'
            }`}
          >
            Բոլորը
          </Badge>
          
          {categories.map((category) => (
            <Badge
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`cursor-pointer hover:bg-primary/80 ${
                selectedCategory === category ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              {category}
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProjectCategories;
