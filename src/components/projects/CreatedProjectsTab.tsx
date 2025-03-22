
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Project {
  id: number;
  title: string;
  description: string;
  techStack?: string[];
  createdBy: string;
}

interface CreatedProjectsTabProps {
  projects: Project[];
  userId: string;
}

const CreatedProjectsTab: React.FC<CreatedProjectsTabProps> = ({ projects, userId }) => {
  const { user } = useAuth();
  const userProjects = projects.filter(p => p.createdBy === userId);

  if (userProjects.length === 0) {
    return (
      <div className="text-center p-10 bg-muted rounded-lg">
        <p className="text-muted-foreground">Դեռևս ստեղծված նախագծեր չկան</p>
        <Link to="/admin" className="text-primary font-medium mt-2 inline-block">
          Ստեղծել նոր նախագիծ
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {userProjects.map((project) => (
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
          
          {/* Display project creator information */}
          <div className="mt-2 mb-4 flex items-center text-xs text-muted-foreground">
            <User className="h-3 w-3 mr-1" />
            <span>Ձեր կողմից ստեղծված</span>
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
