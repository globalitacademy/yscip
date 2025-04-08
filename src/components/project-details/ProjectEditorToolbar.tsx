
import React from 'react';
import { Button } from '@/components/ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { Loader2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface ProjectEditorToolbarProps {
  onSave: () => Promise<boolean>;
  onCancel: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

const ProjectEditorToolbar: React.FC<ProjectEditorToolbarProps> = ({
  onSave,
  onCancel,
  isSaving,
  hasUnsavedChanges
}) => {
  const navigate = useNavigate();
  const { project } = useProject();
  
  if (!project) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 py-2 px-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Խմբագրման ռեժիմ</span>
        {hasUnsavedChanges && (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Չպահպանված փոփոխություններ
          </Badge>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
          disabled={isSaving}
          className="flex items-center gap-1"
        >
          <X className="h-4 w-4" /> Չեղարկել
        </Button>
        
        <Button 
          size="sm" 
          onClick={onSave}
          disabled={isSaving || !hasUnsavedChanges}
          className="flex items-center gap-1"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-1" /> Պահպանվում է...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Պահպանել
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProjectEditorToolbar;
