
import React from 'react';
import { Code } from 'lucide-react';

interface ProjectTechnologiesProps {
  techStack?: string[];
}

const ProjectTechnologies: React.FC<ProjectTechnologiesProps> = ({ techStack }) => {
  return (
    <div className="mb-4">
      <h4 className="text-sm font-bold mb-2 flex items-center">
        <Code size={16} className="mr-2 text-primary" />
        Տեխնոլոգիաներ
      </h4>
      <div className="flex flex-wrap gap-1">
        {techStack && techStack.length > 0 ? (
          techStack.map((tech, index) => (
            <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {tech}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">Տեխնոլոգիաներ չկան</span>
        )}
      </div>
    </div>
  );
};

export default ProjectTechnologies;
