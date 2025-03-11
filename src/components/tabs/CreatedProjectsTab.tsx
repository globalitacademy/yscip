
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { DBUser } from '@/types/database.types';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  category: string;
  createdBy: string;
  createdAt: string;
  status?: string;
}

interface CreatedProjectsTabProps {
  user: DBUser | null;
  createdProjects: Project[];
}

const CreatedProjectsTab: React.FC<CreatedProjectsTabProps> = ({ user, createdProjects }) => {
  // Filter to only show projects created by the current user
  const userCreatedProjects = createdProjects.filter(p => p.createdBy === user?.id);

  if (userCreatedProjects.length === 0) {
    return (
      <div className="text-center p-10 bg-muted rounded-lg">
        <p className="text-muted-foreground">Դեռևս ստեղծված նախագծեր չկան</p>
        <Link to="/employer/create-project" className="text-primary font-medium mt-2 inline-block">
          Ստեղծել նոր նախագիծ
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {userCreatedProjects.map((project) => (
        <Card key={project.id} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium">{project.title}</h3>
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              <BookOpen size={14} className="mr-1" /> Ստեղծված
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
      ))}
    </div>
  );
};

export default CreatedProjectsTab;
