
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '@/components/common/ImageUploader';
import ProjectImageDialog from '@/components/projects/ProjectImageDialog';

const ProjectHeader = () => {
  const { project, canEdit, updateProject } = useProject();
  const navigate = useNavigate();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  if (!project) {
    return <div className="h-64 bg-gray-100 animate-pulse"></div>;
  }

  const handleImageChange = () => {
    setNewImageUrl(project.image || '');
    setImageDialogOpen(true);
  };

  const handleSaveImage = async () => {
    if (newImageUrl !== project.image) {
      const success = await updateProject({ image: newImageUrl });
      if (success) {
        setImageDialogOpen(false);
      }
    } else {
      setImageDialogOpen(false);
    }
  };

  return (
    <div className="relative h-64 mb-6">
      <div className="absolute inset-0">
        <img 
          src={project.image || 'https://via.placeholder.com/1200x400?text=Նախագծի+նկար'} 
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/20" 
          onClick={() => navigate('/projects')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Վերադառնալ
        </Button>
      </div>

      {canEdit && (
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={handleImageChange}
          >
            <Image className="mr-2 h-4 w-4" />
            Փոխել նկարը
          </Button>
        </div>
      )}

      <div className="absolute bottom-4 left-4 text-white">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <p className="text-sm opacity-90">{project.description}</p>
      </div>

      {/* Image Dialog */}
      <ProjectImageDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        selectedProject={project}
        newImageUrl={newImageUrl}
        setNewImageUrl={setNewImageUrl}
        onSave={handleSaveImage}
      />
    </div>
  );
};

export default ProjectHeader;
