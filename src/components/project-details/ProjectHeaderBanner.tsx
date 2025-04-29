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
  return <div className="relative pb-6 mb-6">
      {/* Banner background */}
      <ProjectBannerBackground image={bannerImage} isEditing={isEditing} canEdit={canEdit} onImageChange={handleImageChange} onEditClick={() => setIsEditing(true)} />
      
      {/* Content overlaid on the banner */}
      
    </div>;
};
export default ProjectHeaderBanner;