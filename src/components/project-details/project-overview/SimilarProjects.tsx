
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProjectTheme } from '@/data/projectThemes';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getProjectImage } from '@/lib/getProjectImage';

interface SimilarProjectsProps {
  similarProjects: ProjectTheme[];
}

const SimilarProjects: React.FC<SimilarProjectsProps> = ({ 
  similarProjects 
}) => {
  if (similarProjects.length === 0) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-3">Նմանատիպ պրոեկտներ</h3>
      <Separator className="mb-4" />
      <div className="space-y-4">
        {similarProjects.map(relatedProject => (
          <Link 
            key={relatedProject.id} 
            to={`/project/${relatedProject.id}`}
            className="flex items-start gap-3 group"
          >
            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
              <img 
                src={getProjectImage(relatedProject)} 
                alt={relatedProject.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium group-hover:text-primary transition-colors">
                {relatedProject.title}
              </h4>
              <Badge variant="outline" className="mt-1 text-xs">
                {relatedProject.category}
              </Badge>
            </div>
          </Link>
        ))}
        
        <Link to="/projects" className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all mt-2">
          Տեսնել բոլոր պրոեկտները <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default SimilarProjects;
