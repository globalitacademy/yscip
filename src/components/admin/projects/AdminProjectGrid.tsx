
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Filter } from 'lucide-react';
import { ProjectManagementProvider } from '@/contexts/ProjectManagementContext';
import { ProjectTheme } from '@/data/projectThemes';
import ProjectManagement from '@/components/ProjectManagement';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import { fetchProjects } from '@/services/projectService';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const AdminProjectGrid: React.FC = () => {
  return (
    <ProjectManagementProvider>
      <AdminProjectContent />
    </ProjectManagementProvider>
  );
};

const AdminProjectContent: React.FC = () => {
  const { projects, loadProjects, isLoading, handleOpenCreateDialog } = useProjectManagement();
  
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Նախագծեր</h2>
          <p className="text-muted-foreground">Կառավարեք և վերահսկեք ուսանողական նախագծերը</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" /> Ֆիլտրեր
          </Button>
          <Button onClick={handleOpenCreateDialog} size="sm">
            <Plus className="h-4 w-4 mr-2" /> Նոր նախագիծ
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-24 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mt-2"></div>
                <div className="h-3 bg-muted rounded w-full mt-2"></div>
              </CardContent>
            </Card>
          ))
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <Link to={`/project/${project.id}`} key={project.id}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-1">{project.category}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  {project.image && (
                    <div className="h-32 mb-3 overflow-hidden rounded-md">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm line-clamp-2">{project.description}</p>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  {project.techStack?.slice(0, 3).map((tech, i) => (
                    <Badge variant="outline" key={i}>{tech}</Badge>
                  ))}
                  {project.techStack && project.techStack.length > 3 && (
                    <Badge variant="outline">+{project.techStack.length - 3}</Badge>
                  )}
                </CardFooter>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-10 text-center border rounded-lg">
            <p className="text-muted-foreground mb-4">Նախագծեր չեն գտնվել</p>
            <Button onClick={handleOpenCreateDialog} size="sm">
              <Plus className="h-4 w-4 mr-2" /> Ստեղծել նախագիծ
            </Button>
          </div>
        )}
      </div>
      
      <ProjectManagement />
    </div>
  );
};

export default AdminProjectGrid;
