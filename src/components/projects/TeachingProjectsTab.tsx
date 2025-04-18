
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { ProjectTheme } from '@/data/projectThemes';

interface TeachingProjectsTabProps {
  assignedProjects?: number[];
  allProjects: ProjectTheme[];
}

const TeachingProjectsTab: React.FC<TeachingProjectsTabProps> = ({ assignedProjects = [], allProjects }) => {
  // Ensure assignedProjects is always an array, even if it's undefined
  const projectsToDisplay = assignedProjects || [];
  
  if (projectsToDisplay.length === 0) {
    return (
      <div className="text-center p-10 bg-muted rounded-lg">
        <p className="text-muted-foreground">Դեռևս դասավանդվող նախագծեր չկան</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projectsToDisplay.map(projectId => {
        const project = allProjects.find(p => Number(p.id) === projectId);
        
        return project ? (
          <Card key={project.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">{project.title}</h3>
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                <BookOpen size={14} className="mr-1" /> Դասավանդվող
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack?.map((tech: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-end mt-4">
              <Link to={`/project/${project.id}`} className="text-primary text-sm font-medium">
                Դիտել մանրամասներ
              </Link>
            </div>
          </Card>
        ) : null;
      }).filter(Boolean)}
    </div>
  );
};

export default TeachingProjectsTab;
