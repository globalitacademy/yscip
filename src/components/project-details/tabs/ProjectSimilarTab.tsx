
import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getProjectImage } from '@/lib/getProjectImage';
import { ProjectTheme } from '@/data/projectThemes';

interface ProjectSimilarTabProps {
  similarProjects: ProjectTheme[];
}

const ProjectSimilarTab: React.FC<ProjectSimilarTabProps> = ({
  similarProjects
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-gray-100' : ''}>
            Նմանատիպ նախագծեր
          </CardTitle>
        </CardHeader>
        <CardContent>
          {similarProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProjects.map((project) => (
                <div 
                  key={project.id}
                  className={`rounded-lg overflow-hidden border ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  } transition-transform hover:scale-[1.02]`}
                >
                  <div 
                    className="h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${getProjectImage(project)})` }}
                  />
                  
                  <div className="p-4">
                    <h3 className={`font-medium mb-2 line-clamp-1 ${theme === 'dark' ? 'text-gray-100' : ''}`}>
                      {project.title}
                    </h3>
                    <p className={`text-sm mb-4 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {project.description}
                    </p>
                    <Button 
                      onClick={() => navigate(`/project/${project.id}`)}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      Դիտել նախագիծը
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-center my-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Նմանատիպ նախագծեր չեն գտնվել
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSimilarTab;
