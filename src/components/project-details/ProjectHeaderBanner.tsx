
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProject } from '@/contexts/ProjectContext';
import ProjectHeaderActions from './ProjectHeaderActions';
import ProjectBannerBackground from './ProjectBannerBackground';
import { getProjectImage } from '@/lib/getProjectImage';
import { Badge } from '@/components/ui/badge';
import { FadeIn, SlideUp } from '@/components/LocalTransitions';
import { toast } from 'sonner';

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
  const [showImageUrl, setShowImageUrl] = useState(false);
  const [imageUrl, setImageUrl] = useState(bannerImage || '');

  // Log state for debugging
  useEffect(() => {
    console.log("ProjectHeaderBanner render");
    console.log("isEditing:", isEditing);
    console.log("canEdit:", canEdit);
    console.log("bannerImage:", bannerImage);
  }, [isEditing, canEdit, bannerImage]);

  // Update local state when project changes
  useEffect(() => {
    setTitle(project.title || '');
    setDescription(project.description || '');
    setBannerImage(project.image || '');
    setImageUrl(project.image || '');
  }, [project]);

  const handleEditClick = async () => {
    if (isEditing) {
      // Save changes
      setIsSaving(true);
      try {
        // Update project with new values - make sure to pass the projectId from the context
        const updatedData = {
          title,
          description,
          image: bannerImage
        };
        console.log("Saving updated project data:", updatedData);
        
        const success = await updateProject(updatedData);
        
        if (success) {
          setIsEditing(false);
          toast.success('Փոփոխությունները հաջողությամբ պահպանվել են');
        } else {
          toast.error('Սխալ տեղի ունեցավ պահպանման ընթացքում։');
        }
      } catch (error) {
        console.error('Failed to update project:', error);
        toast.error('Չհաջողվեց պահպանել փոփոխությունները');
      } finally {
        setIsSaving(false);
      }
    } else {
      // Start editing
      setIsEditing(true);
      toast.info('Դուք մտել եք խմբագրման ռեժիմ');
    }
  };

  const handleCancelEdit = () => {
    // Reset values to original
    setTitle(project.title || '');
    setDescription(project.description || '');
    setBannerImage(project.image || '');
    setImageUrl(project.image || '');
    setIsEditing(false);
    toast.info('Փոփոխությունները չեղարկվել են');
  };

  const handleImageChange = (url: string) => {
    console.log("Image URL changed to:", url);
    setBannerImage(url);
    setImageUrl(url);
    toast.info('Նկարի URL-ը փոխվել է, սակայն չի պահպանվել: Խնդրում ենք սեղմել "Պահպանել" կոճակը՝ փոփոխությունները պահպանելու համար', {
      duration: 5000
    });
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleImageUrlSubmit = () => {
    if (!imageUrl.trim()) {
      toast.error('Նկարի URL-ն չի կարող լինել դատարկ');
      return;
    }
    handleImageChange(imageUrl);
    setShowImageUrl(false);
  };

  return (
    <div className="relative py-0 overflow-hidden text-white min-h-[500px] group">
      {/* Banner Background with Image - Passing correct props */}
      <ProjectBannerBackground 
        image={bannerImage}
        isEditing={isEditing}
        canEdit={canEdit}
        onImageChange={handleImageChange}
        onEditClick={() => setIsEditing(true)}
      />
      
      {/* Content container with important edit info for user */}
      <div className="container relative z-20 mx-auto px-4 pt-32 pb-16 flex flex-col justify-between min-h-[500px]">
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
      
      {/* Edit mode notification with URL edit button */}
      {isEditing && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2">
          <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md border border-white/10">
            Խմբագրման ռեժիմ
          </div>
          
          {/* Նկարի URL-ը փոխելու կոճակը հաղորդագրության կողքին */}
          <Button 
            onClick={() => setShowImageUrl(true)} 
            size="sm"
            className="bg-primary hover:bg-primary/90 border border-white/20 text-white shadow-lg flex items-center gap-1.5 rounded-full px-4 py-1"
          >
            <Link className="h-4 w-4" />
            Փոխել նկարի URL-ը
          </Button>
          
          {/* URL editing modal */}
          {showImageUrl && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md p-6 bg-black/90 rounded-lg border border-white/30 shadow-xl">
                <h3 className="text-white text-xl font-medium mb-4">Փոխել նկարի URL-ը</h3>
                <div className="flex flex-col gap-3">
                  <Input 
                    value={imageUrl} 
                    onChange={handleImageUrlChange} 
                    className="bg-black/60 border-white/50 text-white" 
                    placeholder="https://example.com/image.jpg"
                    autoFocus
                  />
                  <div className="flex gap-2 mt-4 justify-between">
                    <Button 
                      onClick={() => setShowImageUrl(false)} 
                      variant="outline" 
                      className="bg-red-500/10 hover:bg-red-500/20 text-white border-red-500/30"
                    >
                      Չեղարկել
                    </Button>
                    <Button 
                      onClick={handleImageUrlSubmit} 
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Պահպանել
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectHeaderBanner;
