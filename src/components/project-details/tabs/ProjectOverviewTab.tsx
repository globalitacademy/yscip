
import React from 'react';
import { useProject } from '@/contexts/ProjectContext';
import ProjectOverview from '@/components/project-details/ProjectOverview';

const ProjectOverviewTab: React.FC = () => {
  const { project, updateProject } = useProject();

  // Mock project members for demonstration
  const projectMembers = [
    { id: '1', name: 'Աշոտ Սարգսյան', role: 'Project Lead', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Լիլիթ Գրիգորյան', role: 'Developer', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '3', name: 'Կարեն Պողոսյան', role: 'Designer', avatar: 'https://i.pravatar.cc/150?img=3' }
  ];

  // Mock organization for demonstration
  const organization = project.organizationName ? {
    id: '1',
    name: project.organizationName || '',
    website: 'https://example.com',
    logo: 'https://via.placeholder.com/150'
  } : null;

  // Mock similar projects
  const similarProjects = project.similarProjects || [];

  const handleSaveChanges = async (updates: Partial<ProjectTheme>) => {
    // Update project with new data
    const updatedData = {
      ...updates,
      // Include goal only if it exists in the project type
      ...(project.goal !== undefined && { goal: updates.goal })
    };
    
    return await updateProject(updatedData);
  };

  return (
    <ProjectOverview
      project={project}
      projectMembers={projectMembers}
      organization={organization}
      similarProjects={similarProjects}
      onSaveChanges={handleSaveChanges}
    />
  );
};

export default ProjectOverviewTab;
