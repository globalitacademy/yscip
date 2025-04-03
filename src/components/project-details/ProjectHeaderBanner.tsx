
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectTheme } from '@/data/projectThemes';
import { Edit, ArrowLeft, Calendar, Clock, BarChart3, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectHeaderBannerProps {
  project: ProjectTheme;
}

const ProjectHeaderBanner: React.FC<ProjectHeaderBannerProps> = ({ project }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleEditInit } = useProjectManagement();
  
  // Check if user can edit this project (admin, lecturer, employer, or creator)
  const canEdit = user && (
    user.role === 'admin' || 
    user.role === 'lecturer' || 
    user.role === 'employer' ||
    (project && project.createdBy === user.id)
  );
  
  const goBack = () => {
    navigate('/projects');
  };
  
  const handleEdit = () => {
    // Navigate to the edit page
    navigate(`/project/edit/${project.id}`);
  };
  
  // Format the category with a badge
  const getCategoryBadge = () => {
    let colorClass = "bg-gray-100 text-gray-800";
    
    switch (project.category?.toLowerCase()) {
      case 'web development':
      case 'web':
        colorClass = "bg-blue-100 text-blue-800";
        break;
      case 'mobile':
      case 'mobile development':
        colorClass = "bg-green-100 text-green-800";
        break;
      case 'ai':
      case 'machine learning':
        colorClass = "bg-purple-100 text-purple-800";
        break;
      case 'data science':
        colorClass = "bg-yellow-100 text-yellow-800";
        break;
      default:
        break;
    }
    
    return (
      <Badge variant="outline" className={`${colorClass} px-3 py-1 rounded-full`}>
        {project.category}
      </Badge>
    );
  };
  
  // Format the complexity as a color-coded badge
  const getComplexityBadge = () => {
    const complexity = project.complexity || 'Միջին';
    let colorClass = "bg-yellow-100 text-yellow-800"; // Default for Միջին
    
    if (complexity === 'Սկսնակ') {
      colorClass = "bg-green-100 text-green-800";
    } else if (complexity === 'Առաջադեմ') {
      colorClass = "bg-red-100 text-red-800";
    }
    
    return (
      <Badge variant="outline" className={`${colorClass} px-3 py-1 rounded-full`}>
        {complexity}
      </Badge>
    );
  };
  
  return (
    <div className="relative mb-8">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 h-64 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${project.image || 'https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=2070'})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
      </div>
      
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
          <h1 className="text-3xl font-bold text-white">{project.title}</h1>
          {canEdit && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-black transition-colors hidden sm:flex"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                Խմբագրել
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="text-white border-white hover:bg-white hover:text-black transition-colors sm:hidden"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3 mb-4">
          {project.category && getCategoryBadge()}
          {getComplexityBadge()}
          {project.is_public ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              Հրապարակային
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full flex items-center">
              <EyeOff className="h-3 w-3 mr-1" />
              Մասնավոր
            </Badge>
          )}
        </div>
        
        <p className="text-white text-lg mb-4 max-w-3xl">{project.description}</p>
        
        <div className="flex flex-wrap gap-4 text-white/80">
          {project.duration && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{project.duration}</span>
            </div>
          )}
          
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span>{project.techStack.length} տեխնոլոգիաներ</span>
            </div>
          )}
          
          {project.organizationName && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{project.organizationName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectHeaderBanner;
