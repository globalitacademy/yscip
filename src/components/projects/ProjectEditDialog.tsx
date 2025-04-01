
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { ProjectTheme } from '@/data/projectThemes';
import ProjectTechStack from '@/components/project-creation/ProjectTechStack';
import ProjectImplementationSteps from '@/components/project-creation/ProjectImplementationSteps';
import ProjectLearningDetails from '@/components/project-creation/ProjectLearningDetails';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ProjectEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject: ProjectTheme | null;
  editedProject: Partial<ProjectTheme>;
  setEditedProject: (editedProject: Partial<ProjectTheme>) => void;
  onSave: () => void;
}

const ProjectEditDialog: React.FC<ProjectEditDialogProps> = ({
  open,
  onOpenChange,
  selectedProject,
  editedProject,
  setEditedProject,
  onSave
}) => {
  const [currentSection, setCurrentSection] = useState<'basic' | 'tech' | 'steps' | 'learning'>('basic');
  
  if (!selectedProject) return null;
  
  // Helper function to handle nested state updates
  const updateField = (field: string, value: any) => {
    setEditedProject({ ...editedProject, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Նախագծի խմբագրում</DialogTitle>
          <DialogDescription>
            Խմբագրեք "{selectedProject?.title}" նախագծի բոլոր տվյալները։
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex gap-2 mb-6 border-b overflow-x-auto">
            <Button 
              variant={currentSection === 'basic' ? 'default' : 'ghost'} 
              onClick={() => setCurrentSection('basic')}
              className="rounded-b-none"
            >
              Հիմնական
            </Button>
            <Button 
              variant={currentSection === 'tech' ? 'default' : 'ghost'} 
              onClick={() => setCurrentSection('tech')}
              className="rounded-b-none"
            >
              Տեխնոլոգիաներ
            </Button>
            <Button 
              variant={currentSection === 'steps' ? 'default' : 'ghost'} 
              onClick={() => setCurrentSection('steps')}
              className="rounded-b-none"
            >
              Քայլեր
            </Button>
            <Button 
              variant={currentSection === 'learning' ? 'default' : 'ghost'} 
              onClick={() => setCurrentSection('learning')}
              className="rounded-b-none"
            >
              Սովորելիքներ
            </Button>
          </div>
          
          {currentSection === 'basic' && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-sm font-medium">Վերնագիր</label>
                <Input
                  id="title"
                  value={editedProject.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-sm font-medium">Կատեգորիա</label>
                <Input
                  id="category"
                  value={editedProject.category || ''}
                  onChange={(e) => updateField('category', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="complexity" className="text-sm font-medium">Բարդություն</label>
                <Select
                  value={editedProject.complexity || 'Սկսնակ'}
                  onValueChange={(value: 'Սկսնակ' | 'Միջին' | 'Առաջադեմ') => updateField('complexity', value)}
                >
                  <SelectTrigger id="complexity">
                    <SelectValue placeholder="Ընտրեք բարդությունը" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Սկսնակ">Սկսնակ</SelectItem>
                    <SelectItem value="Միջին">Միջին</SelectItem>
                    <SelectItem value="Առաջադեմ">Առաջադեմ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="duration" className="text-sm font-medium">Տևողություն</label>
                <Input
                  id="duration"
                  value={editedProject.duration || ''}
                  onChange={(e) => updateField('duration', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-sm font-medium">Համառոտ նկարագրություն</label>
                <Textarea
                  id="description"
                  value={editedProject.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="detailedDescription" className="text-sm font-medium">Մանրամասն նկարագրություն</label>
                <Textarea
                  id="detailedDescription"
                  value={editedProject.detailedDescription || ''}
                  onChange={(e) => updateField('detailedDescription', e.target.value)}
                  rows={6}
                />
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <Switch 
                  id="is_public" 
                  checked={editedProject.is_public ?? false}
                  onCheckedChange={(checked) => updateField('is_public', checked)}
                />
                <Label htmlFor="is_public">Հրապարակային նախագիծ</Label>
              </div>
            </div>
          )}
          
          {currentSection === 'tech' && (
            <ProjectTechStack
              techStack={editedProject.techStack || []}
              onTechStackChange={(techStack) => updateField('techStack', techStack)}
            />
          )}
          
          {currentSection === 'steps' && (
            <ProjectImplementationSteps
              steps={editedProject.steps || []}
              onStepsChange={(steps) => updateField('steps', steps)}
            />
          )}
          
          {currentSection === 'learning' && (
            <ProjectLearningDetails
              prerequisites={editedProject.prerequisites || []}
              onPrerequisitesChange={(prerequisites) => updateField('prerequisites', prerequisites)}
              learningOutcomes={editedProject.learningOutcomes || []}
              onLearningOutcomesChange={(learningOutcomes) => updateField('learningOutcomes', learningOutcomes)}
            />
          )}
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Չեղարկել</Button>
          <Button onClick={onSave} className="w-full sm:w-auto">Պահպանել</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditDialog;
