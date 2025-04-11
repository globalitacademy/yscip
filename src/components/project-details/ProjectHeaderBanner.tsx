
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Edit2, 
  ArrowLeft, 
  Share2, 
  BookOpen,
  Users,
  Tag,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectTheme } from '@/data/projectThemes';
import { useProject } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { getFormattedImageUrl, handleImageError } from '@/utils/imageUtils';

interface ProjectHeaderBannerProps {
  project: ProjectTheme;
}

const ProjectHeaderBanner: React.FC<ProjectHeaderBannerProps> = ({ project }) => {
  const navigate = useNavigate();
  const { canEdit, setIsEditing, isEditing, projectProgress } = useProject();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  // Get properly formatted image URLs
  const bannerImage = getFormattedImageUrl(
    project.bannerImage || project.image, 
    project.category
  );
  
  const projectImage = getFormattedImageUrl(
    project.image, 
    project.category
  );
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryColor = (category: string) => {
    const categoryColorMap: Record<string, string> = {
      'Web Development': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Mobile App Development': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'AI & Machine Learning': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Data Science': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Cybersecurity': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'DevOps': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'UI/UX Design': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    };
    
    return categoryColorMap[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };
  
  return (
    <div className="relative">
      {/* Banner Image */}
      <div 
        className="h-64 md:h-96 w-full bg-cover bg-center relative" 
        style={{ backgroundImage: `url('${bannerImage}')` }}
        onError={(e) => handleImageError(e, project.category)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
      </div>
      
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1 bg-white/80 backdrop-blur-sm hover:bg-white/90 dark:bg-gray-900/80 dark:hover:bg-gray-900/90"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Նախագծերի էջ</span>
        </Button>
      </div>
      
      {/* Edit/Share Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-1 bg-white/80 backdrop-blur-sm hover:bg-white/90 dark:bg-gray-900/80 dark:hover:bg-gray-900/90"
        >
          <Share2 className="h-4 w-4" />
          <span>{copied ? 'Պատճենված է' : 'Կիսվել'}</span>
        </Button>
        
        {canEdit && (
          <Button
            variant={isEditing ? "destructive" : "secondary"}
            size="sm"
            onClick={handleEditToggle}
            className={`flex items-center gap-1 ${
              isEditing 
                ? 'bg-red-500/80 hover:bg-red-500/90' 
                : 'bg-white/80 backdrop-blur-sm hover:bg-white/90 dark:bg-gray-900/80 dark:hover:bg-gray-900/90'
            }`}
          >
            <Edit2 className="h-4 w-4" />
            <span>{isEditing ? 'Ավարտել խմբագրումը' : 'Խմբագրել'}</span>
          </Button>
        )}
      </div>
      
      {/* Content Card */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-20 md:-mt-28 bg-white dark:bg-gray-900 rounded-t-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Project Image */}
            <div className="hidden md:block flex-shrink-0">
              <div 
                className="w-32 h-32 rounded-lg overflow-hidden border-4 border-white dark:border-gray-800 shadow-md"
                style={{ 
                  backgroundImage: `url('${projectImage}')`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center' 
                }}
              />
            </div>
            
            {/* Project Info */}
            <div className="flex-grow">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={`${getCategoryColor(project.category)}`}>
                  {project.category}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {project.complexity}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {project.duration}
                </Badge>
                {project.organizationName && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {project.organizationName}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{project.title}</h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
              
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.technologies.map((tech, index) => (
                    <Badge variant="secondary" key={index} className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Progress Bar */}
              {projectProgress > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Առաջընթաց</span>
                    <span>{projectProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${projectProgress}%` }}
                    ></div>
                  </div>
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
