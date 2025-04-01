
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useAdminProjects } from '@/hooks/useAdminProjects';
import ProjectFilters from './ProjectFilters';
import UserBadges from './UserBadges';
import ProjectGrid from './ProjectGrid';
import ProjectTable from './ProjectTable';
import ProjectAssignDialog from './ProjectAssignDialog';
import ProjectApproveDialog from './ProjectApproveDialog';
import { LayoutGrid, Table } from 'lucide-react';

const AdminProjectGrid: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
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
    setActiveCategory,
    setFilterStatus,
    loadMore,
    handleSelectProject,
    handleAssignProject,
    handleApproveProject,
    handleEditProject,
    handleImageChange,
    handleDeleteProject,
    setIsAssignDialogOpen,
    setIsApproveDialogOpen
  } = useAdminProjects();
  
  return (
    <div className="mt-8 text-left">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ադմինիստրատիվ նախագծերի կառավարում</h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
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
            
            {/* View Toggle Buttons */}
            <div className="flex items-center border rounded-md overflow-hidden ml-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm" 
                className="rounded-none px-3"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={16} className="mr-1" />
                <span className="sr-only sm:not-sr-only sm:inline-block">Ցանց</span>
              </Button>
              <Button 
                variant={viewMode === 'table' ? 'default' : 'ghost'} 
                size="sm" 
                className="rounded-none px-3"
                onClick={() => setViewMode('table')}
              >
                <Table size={16} className="mr-1" />
                <span className="sr-only sm:not-sr-only sm:inline-block">Աղյուսակ</span>
              </Button>
            </div>
          </div>
          
          <UserBadges
            user={user}
            projectCount={filteredProjects.length}
          />
        </div>

        {viewMode === 'grid' ? (
          <ProjectGrid
            projects={visibleProjects}
            onSelectProject={handleSelectProject}
            onEditProject={handleEditProject}
            onImageChange={handleImageChange}
            onDeleteProject={handleDeleteProject}
            userRole={user?.role}
          />
        ) : (
          <ProjectTable
            projects={visibleProjects}
            onSelectProject={handleSelectProject}
            onEditProject={handleEditProject}
            onImageChange={handleImageChange}
            onDeleteProject={handleDeleteProject}
            userRole={user?.role}
          />
        )}
        
        <div className="flex justify-center space-x-4 mt-8">
          {hasMore && (
            <Button onClick={loadMore} variant="outline" size="lg">
              Տեսնել ավելին
            </Button>
          )}
        </div>
      </div>
      
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
  );
};

export default AdminProjectGrid;
