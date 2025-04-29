
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProjectImage } from '@/lib/getProjectImage';
import { ProjectTheme } from '@/data/projectThemes';
import ThemeToggle from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

interface ProjectBannerProps {
  project: ProjectTheme;
  isEditing: boolean;
  onSaveChanges: (updates: Partial<ProjectTheme>) => Promise<void>;
}

const ProjectBanner: React.FC<ProjectBannerProps> = ({ project, isEditing, onSaveChanges }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [bannerImage, setBannerImage] = useState(project.image || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    if (!isEditing) return;
    
    setIsSaving(true);
    try {
      await onSaveChanges({
        title,
        description,
        image: bannerImage
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    setTitle(project.title);
    setDescription(project.description);
    setBannerImage(project.image || '');
  };
  
  const imageUrl = getProjectImage(project);
  
  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="absolute top-0 left-0 w-full h-64 md:h-80 lg:h-96">
        <div className="absolute inset-0 bg-black/60 z-0" />
        <img 
          src={imageUrl}
          alt={project.title}
          className="w-full h-full object-cover object-center"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent"
          style={{ top: '60%' }}
        />
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto pt-20 pb-12 px-4 min-h-[260px] md:min-h-[320px] lg:min-h-[384px] flex flex-col justify-between">
        <div className="flex justify-between items-center w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/projects')}
            className="bg-black/30 text-white hover:bg-black/40"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Վերադառնալ
          </Button>
          
          <ThemeToggle />
        </div>
        
        <div className="mt-auto backdrop-blur-sm rounded-xl border border-white/10 bg-black/30 p-6 w-full max-w-3xl">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl md:text-4xl font-bold text-white bg-transparent border-b border-white/30 w-full mb-3 focus:outline-none focus:border-white"
            />
          ) : (
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{project.title}</h1>
          )}
          
          {isEditing ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-transparent border border-white/30 rounded w-full p-2 text-white resize-none focus:outline-none focus:border-white"
            />
          ) : (
            <p className="text-lg text-white/90">{project.description}</p>
          )}
          
          {isEditing && (
            <div className="mt-4 flex gap-2 justify-end">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-1.5" /> Չեղարկել
              </Button>
              <Button 
                variant="outline"
                className="bg-green-500/20 border-green-500/30 text-white hover:bg-green-500/30"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Պահպանվում է...</>
                ) : (
                  <><Save className="h-4 w-4 mr-1.5" /> Պահպանել</>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectBanner;
