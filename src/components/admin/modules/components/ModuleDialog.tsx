
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { EducationalModule } from '@/components/educationalCycle';

interface ModuleDialogProps {
  open: boolean;
  selectedModule: EducationalModule | null;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onModuleChange: (module: EducationalModule | null) => void;
}

const ModuleDialog: React.FC<ModuleDialogProps> = ({
  open,
  selectedModule,
  onOpenChange,
  onSave,
  onModuleChange
}) => {
  const [newTopic, setNewTopic] = useState('');

  // Create handlers for each field update
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedModule) {
      onModuleChange({
        ...selectedModule,
        title: e.target.value
      });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedModule) {
      onModuleChange({
        ...selectedModule,
        description: e.target.value
      });
    }
  };

  const handleStatusChange = (value: string) => {
    if (selectedModule) {
      onModuleChange({
        ...selectedModule,
        status: value as 'not-started' | 'in-progress' | 'completed'
      });
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedModule) {
      onModuleChange({
        ...selectedModule,
        progress: parseInt(e.target.value, 10)
      });
    }
  };

  const handleAddTopic = () => {
    if (newTopic.trim() === '' || !selectedModule) return;
    
    onModuleChange({
      ...selectedModule,
      topics: [...(selectedModule.topics || []), newTopic.trim()]
    });
    
    setNewTopic('');
  };

  const handleRemoveTopic = (index: number) => {
    if (!selectedModule) return;
    
    const updatedTopics = [...(selectedModule.topics || [])];
    updatedTopics.splice(index, 1);
    
    onModuleChange({
      ...selectedModule,
      topics: updatedTopics
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTopic();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedModule?.id ? 'Խմբագրել մոդուլը' : 'Ավելացնել նոր մոդուլ'}
          </DialogTitle>
          <DialogDescription>
            {selectedModule?.id 
              ? 'Փոփոխեք մոդուլի տվյալները ստորև' 
              : 'Լրացրեք նոր մոդուլի տվյալները'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Անվանում</Label>
            <Input 
              id="title" 
              value={selectedModule?.title || ''} 
              onChange={handleTitleChange} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Նկարագրություն</Label>
            <Textarea 
              id="description" 
              value={selectedModule?.description || ''} 
              onChange={handleDescriptionChange} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Կարգավիճակ</Label>
            <Select 
              value={selectedModule?.status || 'not-started'} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Ընտրեք կարգավիճակը" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Չսկսված</SelectItem>
                <SelectItem value="in-progress">Ընթացքի մեջ է</SelectItem>
                <SelectItem value="completed">Ավարտված է</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="progress">Առաջընթաց (%)</Label>
            <Input 
              id="progress" 
              type="number" 
              min="0" 
              max="100" 
              value={selectedModule?.progress || 0} 
              onChange={handleProgressChange} 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="topics">Թեմաներ</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedModule?.topics?.map((topic, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-1">
                  {topic}
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1"
                    onClick={() => handleRemoveTopic(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                id="new-topic"
                placeholder="Նոր թեմա"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button 
                type="button" 
                size="sm" 
                onClick={handleAddTopic}
                className="shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" /> Ավելացնել
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Չեղարկել</Button>
          <Button onClick={onSave}>Պահպանել</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleDialog;
