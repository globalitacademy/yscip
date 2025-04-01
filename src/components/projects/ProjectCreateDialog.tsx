
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectTheme } from '@/data/projectThemes';

interface ProjectCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: (project: ProjectTheme) => Promise<void>;
}

const ProjectCreateDialog: React.FC<ProjectCreateDialogProps> = ({
  open,
  onOpenChange,
  onProjectCreated
}) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [newProject, setNewProject] = useState<Partial<ProjectTheme>>({
    title: '',
    description: '',
    category: '',
    is_public: false,
    techStack: [],
    organizationName: ''
  });
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setNewProject({
        title: '',
        description: '',
        category: 'Web Development',
        is_public: false,
        createdBy: user?.id,
        techStack: [],
        organizationName: user?.organization || ''
      });
    }
  }, [open, user]);
  
  const handleSave = async () => {
    if (!newProject.title || !newProject.description || !newProject.category) {
      // Show error or validation message
      return;
    }
    
    setIsSaving(true);
    try {
      // Create a complete project object
      const projectToCreate: ProjectTheme = {
        id: 0, // This will be ignored/replaced by the backend
        title: newProject.title || '',
        description: newProject.description || '',
        category: newProject.category || '',
        is_public: newProject.is_public || false,
        createdBy: user?.id,
        createdAt: new Date().toISOString(),
        techStack: newProject.techStack || [],
        organizationName: newProject.organizationName
      };
      
      await onProjectCreated(projectToCreate);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setNewProject({ ...newProject, is_public: checked });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Նոր նախագիծ</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Վերնագիր
            </Label>
            <Input
              id="title"
              name="title"
              value={newProject.title || ''}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Նախագծի վերնագիրը"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Կատեգորիա
            </Label>
            <Input
              id="category"
              name="category"
              value={newProject.category || ''}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Օրինակ՝ Web Development"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="organizationName" className="text-right">
              Կազմակերպություն
            </Label>
            <Input
              id="organizationName"
              name="organizationName"
              value={newProject.organizationName || ''}
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
              value={newProject.description || ''}
              onChange={handleInputChange}
              className="col-span-3"
              rows={4}
              placeholder="Նախագծի մանրամասն նկարագրություն"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="is_public" className="text-right">
              Հրապարակային
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch
                id="is_public"
                checked={newProject.is_public || false}
                onCheckedChange={handleSwitchChange}
              />
              <span className="ml-2 text-sm text-gray-500">
                {newProject.is_public ? 'Այո' : 'Ոչ'}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Պահպանվում է...' : 'Ստեղծել նախագիծ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCreateDialog;
