
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save, X, Loader2 } from 'lucide-react';

interface ProjectHeaderActionsProps {
  canEdit: boolean;
  isEditing: boolean;
  isSaving: boolean;
  onEditClick: () => void;
  onCancelEdit: () => void;
}

const ProjectHeaderActions: React.FC<ProjectHeaderActionsProps> = ({
  canEdit,
  isEditing,
  isSaving,
  onEditClick,
  onCancelEdit
}) => {
  if (!canEdit) {
    return null;
  }

  if (isEditing) {
    return (
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          className="text-white border-white hover:bg-green-500 hover:border-green-500 hover:text-white transition-colors"
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
          className="text-white border-white hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors"
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
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        className="text-white border-white hover:bg-white hover:text-black transition-colors hidden sm:flex"
        onClick={onEditClick}
      >
        <Edit className="h-4 w-4 mr-2" />
        Խմբագրել
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        className="text-white border-white hover:bg-white hover:text-black transition-colors sm:hidden"
        onClick={onEditClick}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProjectHeaderActions;
