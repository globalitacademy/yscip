
import React from 'react';
import { Link } from 'react-router-dom';
import { ProjectTheme } from '@/data/projectThemes';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import { SlideUp } from '@/components/LocalTransitions';
import ProjectMembers from '@/components/projects/ProjectMembers';
import { getProjectImage } from '@/lib/getProjectImage';

interface ProjectOverviewProps {
  project: ProjectTheme;
  projectMembers: { id: string; name: string; role: string; avatar: string }[];
  organization: {
    id: string;
    name: string;
    website: string;
    logo: string;
  } | null;
  similarProjects: ProjectTheme[];
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  projectMembers,
  organization,
  similarProjects,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <SlideUp className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Նախագծի նկարագրություն</h2>
            <div className="prose prose-slate max-w-none">
              <p>{project.detailedDescription || project.description}</p>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Իրականացման քայլեր</h2>
            <div className="space-y-3 relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border"></div>
              {project.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 pl-4 relative">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary z-10">
                    {index + 1}
                  </div>
                  <div className="bg-accent/40 rounded-lg p-4 w-full">
                    <p>{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {project.learningOutcomes && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Ինչ կսովորեք</h2>
              <ul className="space-y-2">
                {project.learningOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </SlideUp>
      </div>
      
      <div>
        <SlideUp className="space-y-8">
          <ProjectMembers members={projectMembers} organization={organization} />
          
          {project.prerequisites && (
            <div className="border border-border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <BookOpen size={18} className="mr-2 text-primary" />
                Նախապայմաններ
              </h3>
              <Separator className="mb-4" />
              <ul className="space-y-2">
                {project.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {similarProjects.length > 0 && (
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
                
                <Link to="/" className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all mt-2">
                  Տեսնել բոլոր պրոեկտները <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </SlideUp>
      </div>
    </div>
  );
};

import { Badge } from '@/components/ui/badge';
export default ProjectOverview;
