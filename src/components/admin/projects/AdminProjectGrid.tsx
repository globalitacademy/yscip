
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useAdminProjects } from '@/hooks/useAdminProjects';
import ProjectFilters from './ProjectFilters';
import UserBadges from './UserBadges';
import ProjectGrid from './ProjectGrid';
import ProjectAssignDialog from './ProjectAssignDialog';
import ProjectApproveDialog from './ProjectApproveDialog';
import ProjectEditDialog from '@/components/projects/ProjectEditDialog';
import { ProjectManagementProvider } from '@/contexts/ProjectManagementContext';

const AdminProjectGrid: React.FC = () => {
  const { user } = useAuth();
  const {
    visibleProjects,
    filteredProjects,
    activeCategory,
    filterStatus,
    categories,
    hasMore,
    selectedProject,
    isAssignDialogOpen,
    isApproveDialogOpen,
    isEditDialogOpen,
    editedProject,
    setActiveCategory,
    setFilterStatus,
    loadMore,
    handleSelectProject,
    handleAssignProject,
    handleApproveProject,
    handleEditProject,
    handleSaveEdit,
    handleImageChange,
    handleDeleteProject,
    setIsAssignDialogOpen,
    setIsApproveDialogOpen,
    setIsEditDialogOpen,
    setEditedProject
  } = useAdminProjects();
  
  return (
    <ProjectManagementProvider>
      <div className="mt-8 text-left">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Ադմինիստրատիվ նախագծերի կառավարում</h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <ProjectFilters
              activeCategory={activeCategory}
              filterStatus={filterStatus}
              categories={categories}
              onCategoryChange={(value) => {
                setActiveCategory(value);
              }}
              onStatusChange={(value) => {
                setFilterStatus(value);
              }}
            />
            
            <UserBadges
              user={user}
              projectCount={filteredProjects.length}
            />
          </div>

          <ProjectGrid
            projects={visibleProjects}
            onSelectProject={handleSelectProject}
            onEditProject={handleEditProject}
            onImageChange={handleImageChange}
            onDeleteProject={handleDeleteProject}
            userRole={user?.role}
          />
          
          <div className="flex justify-center space-x-4 mt-8">
            {hasMore && (
              <Button onClick={loadMore} variant="outline" size="lg">
                Տեսնել ավելին
              </Button>
            )}
          </div>
        </div>
        
        {/* Edit Dialog */}
        <ProjectEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          selectedProject={selectedProject}
          editedProject={editedProject}
          setEditedProject={setEditedProject}
          onSave={handleSaveEdit}
        />
        
        {/* Assign Dialog */}
        <ProjectAssignDialog
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          selectedProject={selectedProject}
          onAssign={handleAssignProject}
        />
        
        {/* Approve Dialog */}
        <ProjectApproveDialog
          open={isApproveDialogOpen}
          onOpenChange={setIsApproveDialogOpen}
          selectedProject={selectedProject}
          onApprove={handleApproveProject}
        />
      </div>
    </ProjectManagementProvider>
  );
};

export default AdminProjectGrid;
