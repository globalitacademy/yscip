
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProject } from '@/contexts/ProjectContext';
import ProjectHeaderActions from './ProjectHeaderActions';
import ProjectBannerBackground from './ProjectBannerBackground';
import { getProjectImage } from '@/lib/getProjectImage';
import { Badge } from '@/components/ui/badge';
import { FadeIn, SlideUp } from '@/components/LocalTransitions';

interface ProjectHeaderBannerProps {
  project: any;
  isEditing: boolean;
}

const ProjectHeaderBanner: React.FC<ProjectHeaderBannerProps> = ({
  project,
  isEditing
}) => {
  const navigate = useNavigate();
  const {
    setIsEditing,
    canEdit,
    updateProject
  } = useProject();
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(project.title || '');
  const [description, setDescription] = useState(project.description || '');
  const [bannerImage, setBannerImage] = useState(project.image || '');

  // Update local state when project changes
  useEffect(() => {
    setTitle(project.title || '');
    setDescription(project.description || '');
    setBannerImage(project.image || '');
  }, [project]);

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
    console.log("Image URL changed to:", url);
    setBannerImage(url);
  };

  return (
    <div className="relative py-0 overflow-hidden text-white min-h-[500px] group">
      {/* Banner Background with Image */}
      <ProjectBannerBackground 
        image={bannerImage || project.image}
        isEditing={isEditing}
        canEdit={canEdit}
        onImageChange={handleImageChange}
        onEditClick={() => setIsEditing(true)}
      />
      
      <div className="container relative z-10 mx-auto px-4 pt-32 pb-16 flex flex-col justify-between min-h-[500px]">
        <FadeIn delay="delay-100">
          <div className="flex justify-between items-start">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/projects')} 
              className="flex items-center gap-1.5 text-white hover:text-white/80 bg-black/20 hover:bg-black/30 backdrop-blur-sm border border-white/10"
            >
              <ArrowLeft className="h-4 w-4" /> 
              Վերադառնալ բոլոր նախագծերի ցանկին
            </Button>
            
            <div className="flex items-center gap-4">
              {canEdit && (
                <ProjectHeaderActions 
                  canEdit={canEdit}
                  isEditing={isEditing}
                  isSaving={isSaving}
                  onEditClick={handleEditClick}
                  onCancelEdit={handleCancelEdit}
                />
              )}
            </div>
          </div>
        </FadeIn>
        
        <SlideUp delay="delay-300">
          <div className="mt-auto max-w-3xl backdrop-blur-md bg-black/20 p-6 rounded-xl border border-white/10 shadow-xl transform transition-all duration-300 group-hover:translate-y-[-4px]">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-4xl font-bold bg-transparent border-b border-white/30 text-white w-full mb-4 focus:outline-none focus:border-white/60"
                placeholder="Նախագծի վերնագիր"
              />
            ) : (
              <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            )}
            
            {isEditing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-lg bg-transparent border border-white/30 rounded text-white w-full p-2 focus:outline-none focus:border-white/60"
                rows={3}
                placeholder="Նախագծի նկարագրություն"
              />
            ) : (
              <p className="text-lg text-white/80 mb-4">{project.description}</p>
            )}
            
            {project && project.category && (
              <Badge className="mt-4 bg-primary/80 hover:bg-primary text-white backdrop-blur-sm border-white/20">
                {project.category}
              </Badge>
            )}
          </div>
        </SlideUp>
      </div>
    </div>
  );
};

export default ProjectHeaderBanner;
