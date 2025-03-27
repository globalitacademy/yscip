
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ProjectCreation from './ProjectCreation';
import ProjectList from './projects/ProjectList';
import ProjectFilterSection from './projects/ProjectFilterSection';
import ProjectDialogManager from './projects/ProjectDialogManager';
import { ProjectManagementProvider, useProjectManagement } from '@/contexts/ProjectManagementContext';

// Inner component that uses the context
const ProjectManagementContent: React.FC = () => {
  const { 
    isCreateDialogOpen, 
    setIsCreateDialogOpen,
    loadProjects,
    handleProjectCreated,
    projects
  } = useProjectManagement();
  
  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="space-y-4">
      <ProjectFilterSection />
      <ProjectList projects={projects} />
      <ProjectDialogManager />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-y-auto max-h-screen">
          <ProjectCreation onProjectCreated={handleProjectCreated} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Main component that provides the context
const ProjectManagement: React.FC = () => {
  return (
    <ProjectManagementProvider>
      <ProjectManagementContent />
    </ProjectManagementProvider>
  );
};

export default ProjectManagement;
