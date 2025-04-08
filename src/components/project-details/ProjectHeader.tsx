
import React from 'react';
import { ArrowUpRight, Calendar, Clock, Code, Users, Award, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getProjectImage } from '@/lib/getProjectImage';
import { useProject } from '@/contexts/ProjectContext';
import ImageUploader from '@/components/common/image-uploader/ImageUploader';
import EditableField from '@/components/common/EditableField';

const ProjectHeader: React.FC = () => {
  const { 
    project, 
    isEditing, 
    canEdit,
    updateProject
  } = useProject();

  if (!project) return null;

  const imageUrl = getProjectImage(project);
  
  const handleUpdateField = (field: string, value: string | string[]) => {
    updateProject({ [field]: value });
  };

  const handleUpdateImage = (newImageUrl: string) => {
    updateProject({ image: newImageUrl });
  };

  const handleUpdateTech = (tech: string, index: number) => {
    const updatedTechStack = [...project.techStack];
    updatedTechStack[index] = tech;
    updateProject({ techStack: updatedTechStack });
  };

  const handleAddTech = () => {
    const updatedTechStack = [...project.techStack, 'Նոր տեխնոլոգիա'];
    updateProject({ techStack: updatedTechStack });
  };

  const handleRemoveTech = (index: number) => {
    const updatedTechStack = [...project.techStack];
    updatedTechStack.splice(index, 1);
    updateProject({ techStack: updatedTechStack });
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Ավելացվել է {new Date(project.createdAt || Date.now()).toLocaleDateString('hy-AM')}</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground inline-block">
                <EditableField
                  value={project.title}
                  onChange={(value) => handleUpdateField('title', value)}
                  isEditing={isEditing}
                  size="xl"
                  placeholder="Նախագծի վերնագիր"
                />
              </h1>
              <div className="text-muted-foreground">
                <EditableField
                  value={project.description}
                  onChange={(value) => handleUpdateField('description', value)}
                  isEditing={isEditing}
                  multiline
                  placeholder="Նախագծի համառոտ նկարագրություն"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                <>
                  {project.techStack.map((tech, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <EditableField
                        value={tech}
                        onChange={(value) => handleUpdateTech(value, index)}
                        isEditing={true}
                        className="inline-block"
                        size="sm"
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="h-5 w-5 rounded-full bg-red-100 hover:bg-red-200 text-red-700" 
                        onClick={() => handleRemoveTech(index)}
                      >
                        <span className="sr-only">Remove</span>
                        <span aria-hidden="true">×</span>
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTech}
                    className="text-xs"
                  >
                    + Ավելացնել
                  </Button>
                </>
              ) : (
                project.techStack.map((tech, index) => (
                  <Badge variant="outline" key={index} className="bg-muted">
                    {tech}
                  </Badge>
                ))
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center text-sm">
                <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Բարդություն:</span>
                <span className="ml-1 font-medium">
                  <EditableField
                    value={project.complexity || "Միջին"}
                    onChange={(value) => handleUpdateField('complexity', value)}
                    isEditing={isEditing}
                    size="sm"
                    placeholder="Նշել բարդությունը"
                  />
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Տևողություն:</span>
                <span className="ml-1 font-medium">
                  <EditableField
                    value={project.duration || "Նշված չէ"}
                    onChange={(value) => handleUpdateField('duration', value)}
                    isEditing={isEditing}
                    size="sm"
                    placeholder="Օր.՝ 2 շաբաթ"
                  />
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Կատեգորիա:</span>
                <span className="ml-1 font-medium">
                  <EditableField
                    value={project.category}
                    onChange={(value) => handleUpdateField('category', value)}
                    isEditing={isEditing}
                    size="sm"
                    placeholder="Նշել կատեգորիան"
                  />
                </span>
              </div>
              {project.organizationName && (
                <div className="flex items-center text-sm">
                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Կազմակերպություն:</span>
                  <span className="ml-1 font-medium">
                    <EditableField
                      value={project.organizationName}
                      onChange={(value) => handleUpdateField('organizationName', value)}
                      isEditing={isEditing}
                      size="sm"
                      placeholder="Նշել կազմակերպությունը"
                    />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={cn(
          "w-full aspect-video rounded-lg overflow-hidden bg-muted", 
          isEditing ? "border-2 border-dashed border-primary/50" : ""
        )}>
          {isEditing ? (
            <ImageUploader
              currentImage={imageUrl}
              onImageChange={handleUpdateImage}
              previewHeight="h-full"
              placeholder="Սեղմեք՝ նախագծի նկարը փոխելու համար"
              showEditButton={true}
              overlayMode={true}
            />
          ) : (
            <img 
              src={imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
