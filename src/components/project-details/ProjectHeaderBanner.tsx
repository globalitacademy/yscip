
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectTheme } from '@/data/projectThemes';
import { ArrowLeft } from 'lucide-react';
import EditableField from '@/components/common/EditableField';
import { toast } from 'sonner';
import ProjectBadges from './ProjectBadges';
import ProjectTechStack from './ProjectTechStack';
import ProjectHeaderActions from './ProjectHeaderActions';
import ProjectBannerBackground from './ProjectBannerBackground';

interface ProjectHeaderBannerProps {
  project: ProjectTheme;
}

const ProjectHeaderBanner: React.FC<ProjectHeaderBannerProps> = ({ project }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleEditInit } = useProjectManagement();
  const { canEdit, isEditing, setIsEditing, updateProject } = useProject();
  const [isSaving, setIsSaving] = useState(false);
  
  const [editedProject, setEditedProject] = useState<Partial<ProjectTheme>>({
    title: project.title,
    description: project.description,
    category: project.category,
    is_public: project.is_public,
    image: project.image
  });
  
  // Update local state when project changes
  useEffect(() => {
    setEditedProject({
      title: project.title,
      description: project.description,
      category: project.category,
      is_public: project.is_public,
      image: project.image
    });
  }, [project]);
  
  // Safety check to prevent errors if project is undefined
  if (!project) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg shadow mb-4">
        <p className="text-gray-500">Project information unavailable</p>
      </div>
    );
  }
  
  const handleEditClick = async () => {
    if (isEditing) {
      // Save changes
      setIsSaving(true);
      try {
        const success = await updateProject(editedProject);
        if (success) {
          setIsEditing(false);
        }
      } finally {
        setIsSaving(false);
      }
    } else {
      // Start editing
      setIsEditing(true);
    }
  };
  
  const handleCancelEdit = () => {
    setEditedProject({
      title: project.title,
      description: project.description,
      category: project.category,
      is_public: project.is_public,
      image: project.image
    });
    setIsEditing(false);
  };
  
  const goBack = () => {
    navigate('/projects');
  };
  
  const handleFullEdit = () => {
    // Navigate to the edit page
    navigate(`/project/edit/${project.id}`);
  };
  
  const handleImageChange = (imageUrl: string) => {
    setEditedProject({...editedProject, image: imageUrl});
  };
  
  const handleCategoryChange = (value: string) => {
    setEditedProject({...editedProject, category: value});
  };
  
  const handleIsPublicChange = (value: boolean) => {
    setEditedProject({...editedProject, is_public: value});
  };
  
  return (
    <div className="relative mb-8">
      {/* Background image with overlay */}
      <ProjectBannerBackground 
        image={editedProject.image}
        isEditing={isEditing}
        canEdit={canEdit}
        onImageChange={handleImageChange}
        onEditClick={() => setIsEditing(true)}
      />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 pt-16 pb-6">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-4 text-white hover:bg-white/20 transition-colors"
          onClick={goBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Նախագծերի ցանկ
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          {isEditing ? (
            <EditableField 
              value={editedProject.title || ''}
              onChange={(value) => setEditedProject({...editedProject, title: value})}
              size="xl"
              className="text-3xl font-bold text-white bg-black/40 rounded"
              placeholder="Մուտքագրեք նախագծի անվանումը"
              showEditButton={false}
            />
          ) : (
            <h1 className="text-3xl font-bold text-white">{project.title}</h1>
          )}
          
          <ProjectHeaderActions 
            canEdit={canEdit}
            isEditing={isEditing}
            isSaving={isSaving}
            onEditClick={handleEditClick}
            onCancelEdit={handleCancelEdit}
          />
        </div>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <ProjectBadges 
            category={editedProject.category}
            complexity={project.complexity}
            isPublic={editedProject.is_public}
            isEditing={isEditing}
            onCategoryChange={handleCategoryChange}
            onIsPublicChange={handleIsPublicChange}
          />
        </div>
        
        {isEditing ? (
          <EditableField 
            value={editedProject.description || ''}
            onChange={(value) => setEditedProject({...editedProject, description: value})}
            multiline={true}
            className="text-white text-lg mb-4 max-w-3xl bg-black/40 rounded"
            placeholder="Մուտքագրեք նախագծի նկարագրությունը"
            showEditButton={false}
          />
        ) : (
          <p className="text-white text-lg mb-4 max-w-3xl">{project.description}</p>
        )}
        
        <ProjectTechStack 
          duration={project.duration}
          techStackCount={project.techStack?.length}
          organizationName={project.organizationName}
        />
      </div>
    </div>
  );
};

export default ProjectHeaderBanner;
