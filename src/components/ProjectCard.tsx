import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ProjectTheme } from '@/data/projectThemes';
import { ArrowRight, Code, Layers, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: ProjectTheme;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className }) => {
  const complexityColor = {
    Սկսնակ: 'bg-green-500/10 text-green-600 border-green-200',
    Միջին: 'bg-amber-500/10 text-amber-600 border-amber-200',
    Առաջադեմ: 'bg-red-500/10 text-red-600 border-red-200',
  }[project.complexity];

  return (
    <Link 
      to={`/project/${project.id}`}
      className={cn(
        "group relative bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-500 card-hover overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 inset-x-0 h-1 bg-primary rounded-t-xl" />

      <div className="mb-4 flex justify-between items-start">
        <div className="space-y-1">
          <Badge variant="outline" className={cn("font-medium", complexityColor)}>
            {project.complexity}
          </Badge>
          <h3 className="text-xl font-medium mt-2 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
        </div>
      </div>

      <p className="text-muted-foreground mb-6 line-clamp-2">
        {project.description}
      </p>

      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <Code size={18} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Տեխնոլոգիաներ</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {project.techStack.map((tech, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Layers size={18} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Հիմնական քայլեր</p>
            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
              {project.steps.slice(0, 3).map((step, i) => (
                <li key={i} className="flex items-start gap-1">
                  <FileCheck size={12} className="mt-0.5 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
              {project.steps.length > 3 && (
                <li className="text-xs text-primary">+ {project.steps.length - 3} ավելի քայլեր</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
        <Badge variant="outline">{project.category}</Badge>
        <button className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          Տեսնել մանրամասները <ArrowRight size={14} />
        </button>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 pointer-events-none" />
    </Link>
  );
};

export default ProjectCard;
