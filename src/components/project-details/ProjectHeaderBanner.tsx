
import React from 'react';
import { ArrowLeft, Calendar, Clock, Tag, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectTheme } from '@/data/projectThemes';
import ProjectHeaderActions from './ProjectHeaderActions';
import ProjectBannerBackground from './ProjectBannerBackground';
import ProjectTechStack from './ProjectTechStack';
import { toast } from 'sonner';
import ThemeToggle from '@/components/ui/theme-toggle';

interface ProjectHeaderBannerProps {
  project: ProjectTheme;
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
  const [isSaving, setIsSaving] = React.useState(false);
  const [bannerImage, setBannerImage] = React.useState(project.image || project.bannerImage || '');
  const [title, setTitle] = React.useState(project.title || '');
  const [description, setDescription] = React.useState(project.description || '');

  // Update local state when project changes
  React.useEffect(() => {
    setBannerImage(project.image || project.bannerImage || '');
    setTitle(project.title || '');
    setDescription(project.description || '');
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
          toast.success("Փոփոխությունները հաջողությամբ պահպանվել են");
        }
      } catch (error) {
        console.error('Failed to update project:', error);
        toast.error("Սխալ փոփոխություններ պահպանելիս");
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
    setBannerImage(project.image || project.bannerImage || '');
    setIsEditing(false);
  };

  const handleImageChange = (url: string) => {
    setBannerImage(url);
  };

  // Use techStack if available, fallback to technologies
  const techStack = project.techStack || project.technologies || [];
  const techStackCount = techStack.length;

  return (
    <div className="relative pb-6 mb-6">
      {/* Banner background */}
      <ProjectBannerBackground 
        image={bannerImage} 
        isEditing={isEditing} 
        canEdit={canEdit} 
        onImageChange={handleImageChange} 
        onEditClick={() => setIsEditing(true)} 
      />
      
      {/* Content overlaid on the banner */}
      <div className="container relative z-10 px-4 pt-32 pb-6 mx-auto">
        <div className="flex flex-col items-start">
          <div className="flex justify-between items-center w-full mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)} 
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Վերադառնալ
            </Button>
            
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
          
          <div className="max-w-4xl w-full backdrop-blur-sm bg-black/30 p-6 rounded-xl border border-white/10 shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <div className="space-y-3 flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-3xl md:text-4xl font-bold text-white bg-transparent border-b border-white/30 w-full focus:outline-none focus:border-white"
                  />
                ) : (
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{project.title}</h1>
                )}
                
                <ProjectTechStack 
                  duration={project.duration} 
                  techStackCount={techStackCount} 
                  organizationName={project.organizationName} 
                />
                
                {isEditing ? (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="bg-transparent border border-white/30 rounded w-full p-2 text-white resize-none focus:outline-none focus:border-white mt-2"
                  />
                ) : (
                  <p className="text-white/90 max-w-3xl">{project.description}</p>
                )}
              </div>
              
              {canEdit && (
                <div className="ml-4">
                  <ProjectHeaderActions 
                    canEdit={canEdit} 
                    isEditing={isEditing} 
                    isSaving={isSaving}
                    onEditClick={handleEditClick} 
                    onCancelEdit={handleCancelEdit} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeaderBanner;
