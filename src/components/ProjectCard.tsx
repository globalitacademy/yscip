
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ProjectTheme } from '@/data/projectThemes';
import { ArrowRight, Code, Layers, FileCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProjectImage } from '@/lib/getProjectImage';

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

  // Use the image utility function
  const imageUrl = getProjectImage(project);

  return (
    <Link 
      to={`/project/${project.id}`}
      className={cn(
        "group relative bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-500 card-hover overflow-hidden flex flex-col h-full",
        className
      )}
    >
      <div className="absolute top-0 inset-x-0 h-1 bg-primary rounded-t-xl" />
      
      <div className="w-full h-36 sm:h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="p-4 sm:p-6 flex-grow flex flex-col">
        <div className="mb-3 sm:mb-4 flex justify-between items-start">
          <div className="space-y-1">
            <Badge variant="outline" className={cn("font-medium text-xs", complexityColor)}>
              {project.complexity}
            </Badge>
            <h3 className="text-base sm:text-xl font-medium mt-1 sm:mt-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {project.title}
            </h3>
          </div>
        </div>

        <p className="text-muted-foreground mb-4 sm:mb-6 line-clamp-2 text-xs sm:text-sm">
          {project.description}
        </p>

        <div className="space-y-3 sm:space-y-4 flex-grow">
          <div className="flex items-start gap-2">
            <Code size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-medium">Տեխնոլոգիաներ</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {project.techStack.map((tech, i) => (
                  <Badge key={i} variant="secondary" className="text-xs px-1.5 py-0 sm:px-2 sm:py-0.5">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Layers size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-medium">Հիմնական քայլեր</p>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                {project.steps.slice(0, 3).map((step, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <FileCheck size={10} className="mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{step}</span>
                  </li>
                ))}
                {project.steps.length > 3 && (
                  <li className="text-xs text-primary">+ {project.steps.length - 3} ավելի քայլեր</li>
                )}
              </ul>
            </div>
          </div>
          
          {project.duration && (
            <div className="flex items-start gap-2">
              <Clock size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-medium">Տևողություն</p>
                <p className="text-xs text-muted-foreground">{project.duration}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border flex justify-between items-center">
          <Badge variant="outline" className="text-xs">{project.category}</Badge>
          <button className="text-xs sm:text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Տեսնել մանրամասները <ArrowRight size={12} className="sm:size-14" />
          </button>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 pointer-events-none" />
      </div>
    </Link>
  );
};

export default ProjectCard;
