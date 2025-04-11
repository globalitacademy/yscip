
import React, { useState } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import ProjectDetailSection from './ProjectDetailSection';

interface ProjectOverviewProps {
  project: ProjectTheme;
  isEditing: boolean;
  onSaveChanges: (updates: Partial<ProjectTheme>) => Promise<void>;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ 
  project, 
  isEditing,
  onSaveChanges
}) => {
  const [description, setDescription] = useState(project.description);
  const [goal, setGoal] = useState(project.goal || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveDescription = async () => {
    setIsSaving(true);
    try {
      await onSaveChanges({
        description,
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveGoal = async () => {
    setIsSaving(true);
    try {
      await onSaveChanges({
        goal,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <ProjectDetailSection 
        title="Նախագծի նկարագրություն" 
        isEditing={isEditing} 
        onSave={handleSaveDescription}
        isSaving={isSaving}
      >
        {isEditing ? (
          <Textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            rows={6}
            placeholder="Նախագծի մանրամասն նկարագրություն..."
          />
        ) : (
          <p className="whitespace-pre-line">{project.description}</p>
        )}
      </ProjectDetailSection>
      
      <ProjectDetailSection 
        title="Նախագծի նպատակը" 
        isEditing={isEditing}
        onSave={handleSaveGoal}
        isSaving={isSaving}
      >
        {isEditing ? (
          <Textarea 
            value={goal} 
            onChange={e => setGoal(e.target.value)}
            rows={4}
            placeholder="Նախագծի հիմնական նպատակը..."
          />
        ) : (
          <p className="whitespace-pre-line">{project.goal || 'Նախագծի նպատակը սահմանված չէ'}</p>
        )}
      </ProjectDetailSection>
      
      <ProjectDetailSection title="Տեխնոլոգիաների ցանկ" isEditing={false}>
        <div className="flex flex-wrap gap-2">
          {project.technologies && project.technologies.length > 0 ? (
            project.technologies.map((tech, index) => (
              <Card key={index} className="bg-muted">
                <CardContent className="p-2 text-sm">
                  {tech}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">Ոչ մի տեխնոլոգիա նշված չէ</p>
          )}
        </div>
      </ProjectDetailSection>
    </div>
  );
};

export default ProjectOverview;
