import React from 'react';
import { ProjectTheme } from '@/data/projectThemes';

interface ProjectOverviewProps {
  project: ProjectTheme;
  projectMembers: any[];
  organization: any;
  similarProjects: ProjectTheme[];
  onSaveChanges: (updates: Partial<ProjectTheme>) => Promise<any>;
  isEditing?: boolean;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  projectMembers,
  organization,
  similarProjects,
  onSaveChanges,
  isEditing = false
}) => {
  return (
    <div className="space-y-6">
      {/* Project overview content will go here */}
      <h2 className="text-2xl font-bold">{project.title}</h2>
      <p>{project.description}</p>
      
      {/* Additional sections can be added here */}
    </div>
  );
};

export default ProjectOverview;
