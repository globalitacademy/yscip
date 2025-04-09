
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save, X, Loader2 } from 'lucide-react';

interface ProjectHeaderActionsProps {
  canEdit: boolean;
  isEditing: boolean;
  isSaving?: boolean;
  onEditClick: () => void;
  onCancelEdit: () => void;
}

const ProjectHeaderActions: React.FC<ProjectHeaderActionsProps> = ({ 
  canEdit, 
  isEditing, 
  isSaving = false,
  onEditClick, 
  onCancelEdit 
}) => {
  if (!canEdit) return null;
  
  if (isEditing) {
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="bg-green-400/20 border-green-500/30 text-white hover:bg-green-400/30 hover:text-white"
          onClick={onEditClick}
          disabled={isSaving}
        >
          {isSaving ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Պահպանվում է...</>
          ) : (
            <><Save className="h-4 w-4 mr-2" /> Պահպանել</>
          )}
        </Button>
        <Button 
          variant="outline" 
          className="bg-red-400/20 border-red-500/30 text-white hover:bg-red-400/30 hover:text-white"
          onClick={onCancelEdit}
          disabled={isSaving}
        >
          <X className="h-4 w-4 mr-2" />
          Չեղարկել
        </Button>
      </div>
    );
  }
  
  return (
    <Button 
      variant="outline" 
      className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
      onClick={onEditClick}
    >
      <Edit className="h-4 w-4 mr-2" />
      Խմբագրել նախագիծը
    </Button>
  );
};

export default ProjectHeaderActions;
