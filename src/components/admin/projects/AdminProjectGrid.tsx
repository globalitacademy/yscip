
import React, { useState, useEffect } from 'react';
import { ProjectManagementProvider } from '@/contexts/ProjectManagementContext';
import ProjectTable from './ProjectTable';
import ProjectGrid from './ProjectGrid';
import ProjectApproveDialog from './ProjectApproveDialog';
import ProjectAssignDialog from './ProjectAssignDialog';
import AdminProjectActionBar from './AdminProjectActionBar';
import { useAdminProjects } from '@/hooks/useAdminProjects';
import ProjectDialogManager from '@/components/projects/ProjectDialogManager';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import { Loader2 } from 'lucide-react';

const AdminProjectContent = () => {
  const {
    visibleProjects,
    filteredProjects,
    activeCategory,
    categories,
    hasMore,
    selectedProject,
    isAssignDialogOpen,
    isApproveDialogOpen,
    searchQuery,
    setSearchQuery,
    setActiveCategory,
    loadMore,
    handleSelectProject,
    handleAssignProject,
    handleApproveProject,
    setIsAssignDialogOpen,
    setIsApproveDialogOpen
  } = useAdminProjects();

  const {
    handleEditInit,
    handleImageChangeInit,
    handleDeleteInit,
    handleOpenCreateDialog,
    isLoading
  } = useProjectManagement();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminProjectActionBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categories={categories}
        onAddNewProject={handleOpenCreateDialog}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {viewMode === 'grid' ? (
        <ProjectGrid
          projects={visibleProjects}
          onEditProject={handleEditInit}
          onImageChange={handleImageChangeInit}
          onDeleteProject={handleDeleteInit}
          onSelectProject={handleSelectProject}
          adminView
        />
      ) : (
        <ProjectTable
          projects={visibleProjects}
          onEditProject={handleEditInit}
          onImageChange={handleImageChangeInit}
          onDeleteProject={handleDeleteInit}
          onSelectProject={handleSelectProject}
          userRole="admin"
        />
      )}

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-white text-primary border border-primary rounded hover:bg-primary/10 transition"
          >
            Տեսնել ավելին
          </button>
        </div>
      )}

      <ProjectAssignDialog
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        project={selectedProject}
        onAssign={handleAssignProject}
      />

      <ProjectApproveDialog
        isOpen={isApproveDialogOpen}
        onClose={() => setIsApproveDialogOpen(false)}
        project={selectedProject}
        onApprove={handleApproveProject}
      />

      <ProjectDialogManager />
    </div>
  );
};

const AdminProjectGrid = () => {
  return (
    <ProjectManagementProvider>
      <AdminProjectContent />
    </ProjectManagementProvider>
  );
};

export default AdminProjectGrid;
