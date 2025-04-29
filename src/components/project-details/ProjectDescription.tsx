
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectTheme } from '@/data/projectThemes';
import { CheckCircle, BookOpen, Users, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EditableField from '@/components/common/EditableField';
import EditableList from '@/components/common/EditableList';
import { getProjectImage } from '@/lib/getProjectImage';

interface ProjectDescriptionProps {
  project: ProjectTheme;
  projectMembers: { id: string; name: string; role: string; avatar: string }[];
  organization: {
    id: string;
    name: string;
    website: string;
    logo: string;
  } | null;
  similarProjects: ProjectTheme[];
  isEditing: boolean;
  onSaveChanges: (updates: Partial<ProjectTheme>) => Promise<void>;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({
  project,
  projectMembers,
  organization,
  similarProjects,
  isEditing,
  onSaveChanges
}) => {
  const [editedProject, setEditedProject] = useState<Partial<ProjectTheme>>({
    detailedDescription: project.detailedDescription || project.description,
    steps: project.steps || [],
    learningOutcomes: project.learningOutcomes || [],
    prerequisites: project.prerequisites || [],
  });

  useEffect(() => {
    setEditedProject({
      detailedDescription: project.detailedDescription || project.description,
      steps: project.steps || [],
      learningOutcomes: project.learningOutcomes || [],
      prerequisites: project.prerequisites || [],
    });
  }, [project, isEditing]);

  const handleSave = async (field: string, value: any) => {
    setEditedProject(prev => ({...prev, [field]: value}));
    
    // Only save if editing is enabled
    if (isEditing) {
      await onSaveChanges({[field]: value});
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Նախագծի նկարագրություն</CardTitle>
          </CardHeader>
          <CardContent>
            <EditableField
              value={editedProject.detailedDescription || ''}
              onChange={(value) => handleSave('detailedDescription', value)}
              multiline={true}
              placeholder="Մուտքագրեք նախագծի մանրամասն նկարագրությունը"
              disabled={!isEditing}
              showEditButton={false}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Իրականացման քայլեր</CardTitle>
          </CardHeader>
          <CardContent>
            <EditableList
              items={editedProject.steps || []}
              onChange={(steps) => handleSave('steps', steps)}
              placeholder="Մուտքագրեք նոր քայլը..."
              listType="steps"
              disabled={!isEditing}
            />
            
            {(!editedProject.steps || editedProject.steps.length === 0) && !isEditing && (
              <p className="text-muted-foreground italic">Քայլեր չեն նշված</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ինչ կսովորեք</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isEditing ? (
                <EditableList
                  items={editedProject.learningOutcomes || []}
                  onChange={(outcomes) => handleSave('learningOutcomes', outcomes)}
                  placeholder="Մուտքագրեք նոր ուսումնական արդյունք..."
                  listType="bulleted"
                  disabled={!isEditing}
                />
              ) : (
                editedProject.learningOutcomes && editedProject.learningOutcomes.length > 0 ? (
                  <ul className="space-y-2">
                    {editedProject.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground italic">Ուսումնական արդյունքներ չեն նշված</p>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        {/* Project Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={18} /> Թիմ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.role}</div>
                  </div>
                </div>
              ))}
              
              {organization && (
                <>
                  <Separator />
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={organization.logo} />
                      <AvatarFallback><Building size={18} /></AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{organization.name}</div>
                      <div className="text-sm text-primary hover:underline">
                        <a href={organization.website} target="_blank" rel="noopener noreferrer">
                          {organization.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Prerequisites */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={18} /> Նախապայմաններ
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <EditableList
                items={editedProject.prerequisites || []}
                onChange={(prerequisites) => handleSave('prerequisites', prerequisites)}
                placeholder="Մուտքագրեք նոր նախապայման..."
                listType="bulleted"
                disabled={!isEditing}
              />
            ) : (
              editedProject.prerequisites && editedProject.prerequisites.length > 0 ? (
                <ul className="space-y-2">
                  {editedProject.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground italic text-sm">Նախապայմաններ չեն նշված</p>
              )
            )}
          </CardContent>
        </Card>
        
        {/* Similar Projects */}
        {similarProjects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Նմանատիպ պրոեկտներ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {similarProjects.map(relatedProject => (
                  <div key={relatedProject.id} className="flex gap-3 group cursor-pointer">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={getProjectImage(relatedProject)} 
                        alt={relatedProject.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium group-hover:text-primary transition-colors">
                        {relatedProject.title}
                      </h4>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {relatedProject.category}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <Button variant="link" className="p-0 h-auto text-sm" asChild>
                  <a href="/projects">Տեսնել բոլոր պրոեկտները</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectDescription;
