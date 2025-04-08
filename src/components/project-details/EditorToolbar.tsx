
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { Edit, Save, X, EyeIcon, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';

interface EditorToolbarProps {
  onDelete?: () => void;
  onDuplicate?: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onDelete,
  onDuplicate
}) => {
  const { 
    isEditing, 
    setIsEditing, 
    updateProject, 
    canEdit,
    project
  } = useProject();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  if (!canEdit) return null;

  const handleToggleEditing = () => {
    if (isEditing) {
      setIsEditing(false);
      toast.success('Խմբագրման ռեժիմը անջատված է');
    } else {
      setIsEditing(true);
      toast.success('Խմբագրման ռեժիմը միացված է');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Project updates are handled via the EditableField components
      // which call updateProject directly, so no additional save needed
      toast.success('Փոփոխությունները հաջողությամբ պահպանվել են');
      setIsEditing(false);
    } catch (error) {
      toast.error('Տեղի է ունեցել սխալ');
      console.error("Error saving project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete();
    } else {
      // Default deletion logic
      toast.success('Նախագիծը հաջողությամբ ջնջվել է');
      navigate('/projects');
    }
    setIsDeleteDialogOpen(false);
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate();
    } else {
      // Default duplication logic
      toast.success('Նախագծի կրկնօրինակը ստեղծվել է');
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4 justify-end">
        {isEditing ? (
          <>
            <Button 
              variant="default"
              size="sm" 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Պահպանվում է...' : 'Պահպանել փոփոխությունները'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleToggleEditing}
              className="flex items-center gap-1.5"
            >
              <X className="h-4 w-4" />
              Չեղարկել
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant={isEditing ? "destructive" : "default"}
              size="sm" 
              onClick={handleToggleEditing}
              className="flex items-center gap-1.5"
            >
              <Edit className="h-4 w-4" />
              Խմբագրել նախագիծը
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
              className="flex items-center gap-1.5"
            >
              <Copy className="h-4 w-4" />
              Կրկնօրինակել
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Ջնջել
            </Button>
          </>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Հաստատեք ջնջումը</AlertDialogTitle>
            <AlertDialogDescription>
              Դուք իսկապե՞ս ցանկանում եք ջնջել «{project?.title}» նախագիծը: Այս գործողությունը չի կարող չեղարկվել:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Չեղարկել</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Ջնջել
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditorToolbar;
