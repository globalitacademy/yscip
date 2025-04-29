
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProject } from '@/contexts/ProjectContext';
import ProjectHeaderActions from './ProjectHeaderActions';
import ThemeToggle from '@/components/ui/theme-toggle';

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
  const [isSaving, setIsSaving] = React.useState(false);
  const [title, setTitle] = React.useState(project.title || '');
  const [description, setDescription] = React.useState(project.description || '');

  // Update local state when project changes
  React.useEffect(() => {
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
          description
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
    setIsEditing(false);
  };

  return (
    <div className="relative py-10 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/projects')} 
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> 
            Վերադառնալ բոլոր պրոեկտների ցանկին
          </Button>
          
          <div>
            {project && project.category && (
              <span className="bg-red-100 text-red-700 text-xs font-medium px-3 py-1.5 rounded">
                Առաջարկված
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeaderBanner;
