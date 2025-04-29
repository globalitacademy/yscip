
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

interface ProjectHeaderBannerProps {
  project: ProjectTheme;
  isEditing: boolean;
}

const ProjectHeaderBanner: React.FC<ProjectHeaderBannerProps> = ({ project, isEditing }) => {
  const navigate = useNavigate();
  const { setIsEditing, canEdit, updateProject } = useProject();
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
      <div className="container mx-auto px-4 relative z-10">
        <div className="backdrop-blur-sm bg-black/20 rounded-xl p-6 mt-64 md:mt-80 border border-white/10 shadow-xl">
          <Button 
            variant="outline" 
            size="sm"
            className="mb-4 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
            onClick={() => navigate('/admin/admin-projects')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Վերադառնալ նախագծերին
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-end">
            <div className="space-y-3 max-w-3xl">
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
                <p className="text-sm md:text-base text-white/90">{description}</p>
              )}
              
              <ProjectTechStack 
                duration={project.duration}
                techStackCount={techStackCount}
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
    </div>
  );
};

export default ProjectHeaderBanner;
