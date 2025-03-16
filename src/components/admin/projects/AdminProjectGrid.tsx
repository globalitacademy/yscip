
import React from 'react';
import ProjectGrid from '@/components/admin/projects/ProjectGrid';

const AdminProjectGrid: React.FC = () => {
  return (
    <ProjectGrid 
      projects={[]} 
      onSelectProject={() => {}}
      onEditProject={() => {}}
      onImageChange={() => {}}
      onDeleteProject={() => {}}
    />
  );
};

export default AdminProjectGrid;
