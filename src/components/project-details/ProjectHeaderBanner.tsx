
import React from 'react';
import { ArrowLeft, Calendar, Clock, Tag, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectTheme } from '@/data/projectThemes';
import { getProjectImage } from '@/lib/getProjectImage';
import ProjectHeaderActions from './ProjectHeaderActions';
import ProjectBannerBackground from './ProjectBannerBackground';
import ProjectTechStack from './ProjectTechStack';

interface ProjectHeaderBannerProps {
  project: ProjectTheme;
}

const ProjectHeaderBanner: React.FC<ProjectHeaderBannerProps> = ({ project }) => {
  const navigate = useNavigate();
  const { isEditing, setIsEditing, canEdit, updateProject } = useProject();
  const [isSaving, setIsSaving] = React.useState(false);
  const [bannerImage, setBannerImage] = React.useState(project.image || '');
  const [title, setTitle] = React.useState(project.title || '');
  const [description, setDescription] = React.useState(project.description || '');

  const handleEditClick = async () => {
    if (isEditing) {
      // Save changes
      setIsSaving(true);
      try {
        // Update project with new values
        const success = await updateProject({ 
          title, 
          description,
          image: bannerImage
        });
        
        if (success) {
          setIsEditing(false);
        }
      } catch (error) {
        console.error('Failed to update project:', error);
      } finally {
        setIsSaving(false);
      }
    } else {
      // Start editing
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    // Reset values to original
    setTitle(project.title || '');
    setDescription(project.description || '');
    setBannerImage(project.image || '');
    setIsEditing(false);
  };

  const handleImageChange = (url: string) => {
    setBannerImage(url);
  };

  return (
    <div className="relative pb-6 mb-6">
      {/* Banner background */}
      <ProjectBannerBackground 
        image={bannerImage}
        isEditing={isEditing}
        canEdit={canEdit}
        onImageChange={handleImageChange}
        onEditClick={handleEditClick}
      />
      
      {/* Content overlaid on the banner */}
      <div className="container mx-auto px-4 relative pt-72 md:pt-96">
        <Button 
          variant="outline" 
          size="sm"
          className="mb-4 bg-white/10 hover:bg-white/20 text-white border-white/30"
          onClick={() => navigate('/projects')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Վերադառնալ նախագծերին
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end">
          <div className="space-y-2 max-w-3xl">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-3xl md:text-4xl font-bold text-white bg-transparent border-b border-white/30 focus:border-white outline-none pb-1 w-full"
                placeholder="Նախագծի վերնագիր"
              />
            ) : (
              <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
            )}
            
            {isEditing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-sm md:text-base text-white/80 bg-transparent border border-white/30 focus:border-white outline-none p-2 w-full rounded-md resize-none"
                rows={3}
                placeholder="Նախագծի համառոտ նկարագրություն"
              />
            ) : (
              <p className="text-sm md:text-base text-white/80">{description}</p>
            )}
            
            <ProjectTechStack 
              duration={project.duration}
              techStackCount={project.techStack?.length || 0}
              organizationName={project.organizationName}
            />
          </div>
          
          <ProjectHeaderActions 
            canEdit={canEdit} 
            isEditing={isEditing}
            isSaving={isSaving}
            onEditClick={handleEditClick}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectHeaderBanner;
