
import React from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface ProjectSimilarTabProps {
  similarProjects: ProjectTheme[];
}

const ProjectSimilarTab: React.FC<ProjectSimilarTabProps> = ({ similarProjects }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Նմանատիպ նախագծեր</h2>
      {similarProjects.length === 0 ? (
        <p className="text-muted-foreground">Այս նախագծի համար նմանատիպ նախագծեր նշված չեն:</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {similarProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img 
                  src={project.image || 'https://via.placeholder.com/300x200'} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                <Link 
                  to={`/project/${project.id}`} 
                  className="block mt-4 text-blue-500 hover:underline text-sm"
                >
                  Դիտել նախագիծը
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectSimilarTab;
