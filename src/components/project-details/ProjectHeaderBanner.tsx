
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
  const complexityColor = {
    'Սկսնակ': 'bg-green-500/10 text-green-600 border-green-200',
    'Միջին': 'bg-amber-500/10 text-amber-600 border-amber-200',
    'Առաջադեմ': 'bg-red-500/10 text-red-600 border-red-200',
  }[complexity] || '';
  
  return (
    <>
      <Link to="/" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Վերադառնալ բոլոր պրոեկտների ցանկին
      </Link>
      
      <Badge variant="outline" className={cn("font-medium mb-3", complexityColor)}>
        {complexity}
      </Badge>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
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
