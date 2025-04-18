
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ProjectTheme } from '@/data/projectThemes';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject: ProjectTheme | null;
  editedProject: Partial<ProjectTheme>;
  setEditedProject: (project: Partial<ProjectTheme>) => void;
  onSave: () => Promise<void>;
}

const ProjectEditDialog: React.FC<ProjectEditDialogProps> = ({
  open,
  onOpenChange,
  selectedProject,
  editedProject,
  setEditedProject,
  onSave
}) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  // Reset form when dialog opens or selected project changes
  useEffect(() => {
    if (selectedProject) {
      setEditedProject({
        title: selectedProject.title,
        description: selectedProject.description,
        category: selectedProject.category,
        is_public: selectedProject.is_public,
        organizationName: selectedProject.organizationName
      });
    }
  }, [selectedProject, setEditedProject]);
  
  const handleSave = async () => {
    if (!selectedProject) return;
    
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProject({ ...editedProject, [name]: value });
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setEditedProject({ ...editedProject, is_public: checked });
  };
  
  if (!selectedProject) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Խմբագրել նախագիծը</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Վերնագիր
            </Label>
            <Input
              id="title"
              name="title"
              value={editedProject.title || ''}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Կատեգորիա
            </Label>
            <Input
              id="category"
              name="category"
              value={editedProject.category || ''}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="organizationName" className="text-right">
              Կազմակերպություն
            </Label>
            <Input
              id="organizationName"
              name="organizationName"
              value={editedProject.organizationName || ''}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Կազմակերպության անվանումը"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Նկարագրություն
            </Label>
            <Textarea
              id="description"
              name="description"
              value={editedProject.description || ''}
              onChange={handleInputChange}
              className="col-span-3"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="is_public" className="text-right">
              Հրապարակային
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch
                id="is_public"
                checked={editedProject.is_public || false}
                onCheckedChange={handleSwitchChange}
              />
              <span className="ml-2 text-sm text-gray-500">
                {editedProject.is_public ? 'Այո' : 'Ոչ'}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Պահպանվում է...' : 'Պահպանել'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditDialog;
