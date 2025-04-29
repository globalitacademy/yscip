
import React from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { Calendar, Users, FileText, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProjectDescriptionProps {
  project: ProjectTheme;
  isEditing: boolean;
  onSaveChanges?: (updates: Partial<ProjectTheme>) => void;
  projectMembers?: { id: string; name: string; role: string; avatar: string }[];
  organization?: {
    id: string;
    name: string;
    website: string;
    logo: string;
  } | null;
  similarProjects?: ProjectTheme[];
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({
  project,
  isEditing,
  onSaveChanges,
  projectMembers = [],
  organization = null,
  similarProjects = []
}) => {
  const [detailedDescription, setDetailedDescription] = React.useState(
    project?.detailedDescription || ''
  );

  const handleSave = () => {
    if (onSaveChanges) {
      onSaveChanges({
        detailedDescription
      });
    }
  };

  // Get techStack if available, fallback to technologies
  const techStack = project.techStack || project.technologies || [];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              {project.title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6">
              {project.description}
            </p>
            
            {techStack && techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {techStack.map((tech, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-gray-100 dark:bg-gray-800 text-foreground border-none"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Վերջնաժամկետ:</p>
                  <p className="font-medium">29/05/2025</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Անհատական նախագիծ</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ղեկավար:</p>
                  <p className="font-medium">Արամ Հակոբյան</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Կարգավիճակ:</p>
                  <p className="font-medium">Չնշանակված</p>
                </div>
              </div>
            </div>
            
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Ամրագրել այս պրոեկտը
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-5">
          <div className="rounded-lg overflow-hidden">
            <img 
              src={project.image || "https://source.unsplash.com/random/800x600/?technology"} 
              alt={project.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 mt-12">
        <div className="flex space-x-8">
          <button className="border-b-2 border-primary pb-4 font-medium text-primary">
            Նկարագիր
          </button>
          <button className="pb-4 font-medium text-muted-foreground">
            Ժամանակացույց
          </button>
          <button className="pb-4 font-medium text-muted-foreground">
            Քայլեր
          </button>
          <button className="pb-4 font-medium text-muted-foreground">
            Քննարկումներ
          </button>
          <button className="pb-4 font-medium text-muted-foreground">
            Ֆայլեր
          </button>
          <button className="pb-4 font-medium text-muted-foreground">
            Գնահատական
          </button>
          <button className="pb-4 font-medium text-muted-foreground">
            Թայմլայն
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDescription;
