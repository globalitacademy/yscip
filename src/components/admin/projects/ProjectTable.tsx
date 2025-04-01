import React from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash, Image } from 'lucide-react';
import { FadeIn } from '@/components/LocalTransitions';

interface ProjectTableProps {
  projects: ProjectTheme[];
  onSelectProject: (project: ProjectTheme, action: 'assign' | 'approve') => void;
  onEditProject: (project: ProjectTheme) => void;
  onImageChange: (project: ProjectTheme) => void;
  onDeleteProject: (project: ProjectTheme) => void;
  userRole?: string;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onSelectProject,
  onEditProject,
  onImageChange,
  onDeleteProject,
  userRole
}) => {
  const permissions = useProjectPermissions(userRole);
  const { user } = useAuth();

  // Filter projects based on permissions
  const filteredProjects = projects.filter(project => {
    // First check if it's a real project from database
    const isRealProject = project.is_public !== undefined;
    
    if (!isRealProject) return false;
    
    // Admin can see all projects
    if (user?.role === 'admin') return true;
    
    // Instructors, lecturers, and employers can see their own projects
    if (user && (user.role === 'instructor' || user.role === 'lecturer' || user.role === 'employer')) {
      return project.createdBy === user.id;
    }
    
    // Other roles only see public projects
    return project.is_public === true;
  });

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center p-10 bg-muted rounded-lg">
        <p className="text-muted-foreground">Այս կատեգորիայում ծրագրեր չկան</p>
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Վերնագիր</TableHead>
              <TableHead>Կատեգորիա</TableHead>
              <TableHead>Տեխնոլոգիաներ</TableHead>
              <TableHead>Բարդություն</TableHead>
              <TableHead>Հրապարակային</TableHead>
              <TableHead className="text-right">Գործողություններ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack && project.techStack.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.techStack && project.techStack.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.techStack.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{project.complexity || 'Միջին'}</TableCell>
                <TableCell>
                  {project.is_public ? 
                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">Այո</Badge> : 
                    <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">Ոչ</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Button
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => onEditProject(project)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => onImageChange(project)}
                    >
                      <Image size={16} />
                    </Button>
                    <Button
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => onDeleteProject(project)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </FadeIn>
  );
};

export default ProjectTable;
