
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectHeaderBannerProps {
  title: string;
  description: string;
  complexity: string;
  techStack: string[];
}

const ProjectHeaderBanner: React.FC<ProjectHeaderBannerProps> = ({
  title,
  description,
  complexity,
  techStack
}) => {
  // Define complexity color classes
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Սկսնակ':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'Միջին':
        return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'Առաջադեմ':
        return 'bg-red-500/10 text-red-600 border-red-200';
      default:
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
    }
  };
  
  const complexityColor = getComplexityColor(complexity);
  
  return (
    <>
      <Link to="/" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Վերադառնալ բոլոր պրոեկտների ցանկին
      </Link>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
      
      <div className="flex items-center gap-2 mb-4">
        <span className="text-muted-foreground flex items-center">
          <BarChart size={16} className="mr-1" />
          Բարդություն:
        </span>
        <Badge variant="outline" className={cn("font-medium", complexityColor)}>
          {complexity}
        </Badge>
        
        {/* Additional positioning for other badges or information could go here */}
      </div>
      
      <p className="text-lg text-muted-foreground mb-6">{description}</p>
      
      <div className="flex flex-wrap gap-3 mb-6">
        {techStack.map((tech, index) => (
          <Badge key={index} variant="secondary" className="px-3 py-1">
            {tech}
          </Badge>
        ))}
      </div>
    </>
  );
};

export default ProjectHeaderBanner;
