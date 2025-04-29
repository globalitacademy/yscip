
import React, { useState, useEffect } from 'react';
import { SlideUp } from '@/components/LocalTransitions';
import { ProjectTheme } from '@/data/projectThemes';
import { useProject } from '@/contexts/ProjectContext';
import ProjectMembers from '@/components/projects/ProjectMembers';

// Import refactored components
import ProjectDescription from './project-overview/ProjectDescription';
import ProjectSteps from './project-overview/ProjectSteps';
import LearningOutcomes from './project-overview/LearningOutcomes';
import Prerequisites from './project-overview/Prerequisites';
import SimilarProjects from './project-overview/SimilarProjects';
import OverviewActions from './project-overview/OverviewActions';

interface ProjectOverviewProps {
  project: ProjectTheme;
  projectMembers: { id: string; name: string; role: string; avatar: string }[];
  organization: {
    id: string;
    name: string;
    website: string;
    logo: string;
  } | null;
  similarProjects: ProjectTheme[];
  isEditing?: boolean;
  onSaveChanges?: (updates: Partial<ProjectTheme>) => void;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  projectMembers,
  organization,
  similarProjects,
  isEditing = false,
  onSaveChanges = () => {}
}) => {
  const [editedProject, setEditedProject] = useState<Partial<ProjectTheme>>({
    detailedDescription: project.detailedDescription || project.description,
    steps: project.steps || [],
    learningOutcomes: project.learningOutcomes || [],
    prerequisites: project.prerequisites || [],
    organizationName: project.organizationName,
    goal: project.goal || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditedProject({
      detailedDescription: project.detailedDescription || project.description,
      steps: project.steps || [],
      learningOutcomes: project.learningOutcomes || [],
      prerequisites: project.prerequisites || [],
      organizationName: project.organizationName,
      goal: project.goal || ''
    });
  }, [project, isEditing]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      if (onSaveChanges) {
        await onSaveChanges(editedProject);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleOrganizationChange = (value: string) => {
    setEditedProject(prev => ({...prev, organizationName: value}));
    if (onSaveChanges) {
      onSaveChanges({organizationName: value});
    }
  };

  useEffect(() => {
    if (!isEditing && onSaveChanges) {
      const hasChanges = JSON.stringify({
        detailedDescription: project.detailedDescription,
        steps: project.steps,
        learningOutcomes: project.learningOutcomes,
        prerequisites: project.prerequisites,
        organizationName: project.organizationName,
        goal: project.goal
      }) !== JSON.stringify(editedProject);
      
      if (hasChanges) {
        handleSaveChanges();
      }
    }
  }, [isEditing]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <SlideUp className="space-y-8">
          <OverviewActions
            isEditing={isEditing}
            isSaving={isSaving}
            onSave={handleSaveChanges}
          />
          
          <ProjectDescription
            detailedDescription={editedProject.detailedDescription}
            isEditing={isEditing}
            onChange={(value) => setEditedProject({...editedProject, detailedDescription: value})}
          />
          
          <ProjectSteps
            steps={editedProject.steps}
            isEditing={isEditing}
            onChange={(steps) => setEditedProject({...editedProject, steps})}
          />
          
          <LearningOutcomes
            learningOutcomes={editedProject.learningOutcomes}
            isEditing={isEditing}
            onChange={(learningOutcomes) => setEditedProject({...editedProject, learningOutcomes})}
          />
        </SlideUp>
      </div>
      
      <div>
        <SlideUp className="space-y-8">
          <ProjectMembers 
            members={projectMembers} 
            organization={organization} 
            isEditing={isEditing}
            onOrganizationChange={handleOrganizationChange}
          />
          
          <Prerequisites 
            prerequisites={editedProject.prerequisites}
            isEditing={isEditing}
            onChange={(prerequisites) => setEditedProject({...editedProject, prerequisites})}
          />
          
          <SimilarProjects similarProjects={similarProjects} />
        </SlideUp>
      </div>
    </div>
  );
};

export default ProjectOverview;
