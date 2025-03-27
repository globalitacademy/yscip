
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
    handleOpenCreateDialog,
    projects
  } = useProjectManagement();
  
  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Նախագծեր</h2>
        <Button onClick={handleOpenCreateDialog}>
          <Plus className="h-4 w-4 mr-2" /> Նոր նախագիծ
        </Button>
      </div>
      
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
