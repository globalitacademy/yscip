
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProjectTheme } from '@/data/projectThemes';
import { getProjectImage } from '@/lib/getProjectImage';
import { Bookmark, Calendar, Check, Clock, Download, Globe, HardDrive, Clock3, PenTool, Cloud } from 'lucide-react';
import ProjectMembers from '@/components/projects/ProjectMembers';
import { useProject } from '@/contexts/ProjectContext';
import ProjectCard from '@/components/ProjectCard';
import { motion } from 'framer-motion';
import EditableField from '@/components/common/EditableField';
import ProjectImageEditor from './ProjectImageEditor';
import ProjectParticipantsManager from './ProjectParticipantsManager';

export interface ProjectOverviewProps {
  project: ProjectTheme;
  projectMembers: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    status?: 'active' | 'pending' | 'rejected';
  }[];
  organization: {
    id: string;
    name: string;
    website: string;
    logo: string;
  };
  similarProjects: ProjectTheme[];
  isEditing: boolean;
  onSaveChanges: (updates: Partial<ProjectTheme>) => Promise<void>;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  projectMembers,
  organization,
  similarProjects,
  isEditing,
  onSaveChanges
}) => {
  const { updateProjectMembers, updateProject } = useProject();

  const handleImageChange = async (newImageUrl: string) => {
    await updateProject({ image: newImageUrl });
  };

  const handleUpdateMembers = async (members: typeof projectMembers) => {
    // Call the project context method to update members
    return await updateProjectMembers(members);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Main content area */}
      <div className="md:col-span-2 space-y-8">
        {/* Project description card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5 text-primary" />
              Նկարագրություն
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg leading-relaxed">
            {isEditing ? (
              <textarea
                className="w-full min-h-[150px] p-3 border rounded-md"
                defaultValue={project.detailedDescription || project.description}
                onChange={(e) => onSaveChanges({ detailedDescription: e.target.value })}
              />
            ) : (
              <p>{project.detailedDescription || project.description}</p>
            )}
          </CardContent>
        </Card>

        {/* Project details card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              Նախագծի մասին
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Technologies */}
            <div>
              <h3 className="text-lg font-medium mb-2">Տեխնոլոգիաներ</h3>
              <div className="flex flex-wrap gap-2">
                {(project.techStack || []).length > 0 ? (
                  (project.techStack || []).map(tech => (
                    <Badge key={tech} variant="outline" className="py-1.5">
                      {tech}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground italic">Տեխնոլոգիաներ չեն նշված</span>
                )}
              </div>
            </div>

            {/* Prerequisites */}
            <div>
              <h3 className="text-lg font-medium mb-2">Պահանջներ</h3>
              <ul className="list-disc pl-5 space-y-1">
                {(project.prerequisites || []).length > 0 ? (
                  (project.prerequisites || []).map((prerequisite, index) => (
                    <li key={index}>{prerequisite}</li>
                  ))
                ) : (
                  <li className="text-muted-foreground italic">Պահանջներ չեն նշված</li>
                )}
              </ul>
            </div>

            {/* Learning outcomes */}
            <div>
              <h3 className="text-lg font-medium mb-2">Ուսումնական արդյունքներ</h3>
              <ul className="list-disc pl-5 space-y-1">
                {(project.learningOutcomes || []).length > 0 ? (
                  (project.learningOutcomes || []).map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))
                ) : (
                  <li className="text-muted-foreground italic">Ուսումնական արդյունքներ չեն նշված</li>
                )}
              </ul>
            </div>

            {/* Implementation steps */}
            <div>
              <h3 className="text-lg font-medium mb-2">Իրականացման քայլեր</h3>
              <div className="space-y-2">
                {(project.steps || []).length > 0 ? (
                  (project.steps || []).map((step, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                      <Badge className="h-6 w-6 rounded-full flex items-center justify-center p-0">
                        {index + 1}
                      </Badge>
                      <span>{step}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground italic">Իրականացման քայլեր չեն նշված</div>
                )}
              </div>
            </div>

            {/* Meta information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Բարդություն:</span>
                <span className="font-medium">{project.complexity || 'Միջին'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Տևողություն:</span>
                <span className="font-medium">{project.duration || 'Անորոշ'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Կատեգորիա:</span>
                <span className="font-medium">{project.category}</span>
              </div>

              {project.createdAt && (
                <div className="flex items-center gap-2">
                  <Clock3 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Ստեղծվել է:</span>
                  <span className="font-medium">
                    {new Date(project.createdAt).toLocaleDateString('hy-AM')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Similar projects */}
        {similarProjects.length > 0 && (
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-primary" />
                Նմանատիպ նախագծեր
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {similarProjects.slice(0, 2).map(similarProject => (
                  <ProjectCard
                    key={similarProject.id}
                    project={similarProject}
                    className="border-0 shadow-none"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar content */}
      <div className="space-y-8">
        {/* Project image */}
        {isEditing && (
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Նախագծի նկար</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video w-full rounded-lg overflow-hidden border">
                <img 
                  src={getProjectImage(project)} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <ProjectImageEditor 
                currentImage={project.image || null}
                onSave={handleImageChange}
              />
            </CardContent>
          </Card>
        )}
        
        {/* Organization */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Կազմակերպություն</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectMembers 
              organization={organization} 
              isEditing={isEditing} 
            />
          </CardContent>
        </Card>
        
        {/* Project members */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Նախագծի թիմ</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectMembers
              members={projectMembers}
              isEditing={isEditing}
            />
            
            {isEditing && (
              <ProjectParticipantsManager
                projectMembers={projectMembers}
                onUpdateMembers={handleUpdateMembers}
              />
            )}
          </CardContent>
        </Card>

        {/* Action buttons */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button className="w-full" size="lg">
            <Bookmark className="mr-2 h-4 w-4" />
            Ամրագրել նախագիծը
          </Button>
          
          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Ներբեռնել նկարագրությունը
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectOverview;
