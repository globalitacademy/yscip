
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    if (selectedModule && newTopic.trim()) {
      const updatedTopics = [...(selectedModule.topics || []), newTopic.trim()];
      onModuleChange({
        ...selectedModule,
        topics: updatedTopics
      });
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (index: number) => {
    if (selectedModule && selectedModule.topics) {
      const updatedTopics = [...selectedModule.topics];
      updatedTopics.splice(index, 1);
      onModuleChange({
        ...selectedModule,
        topics: updatedTopics
      });
    }
  };

  const handleTopicKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTopic();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
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
        
        <ScrollArea className="flex-grow pr-4">
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
              <Label>Թեմաներ</Label>
              <div className="border rounded-md p-3 bg-muted/30 min-h-20">
                {selectedModule?.topics && selectedModule.topics.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedModule.topics.map((topic, index) => (
                      <li key={index} className="flex items-center justify-between bg-background rounded px-3 py-2 text-sm">
                        <span>{topic}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveTopic(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">Թեմաներ չկան</p>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ավելացնել նոր թեմա"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyDown={handleTopicKeyDown}
                />
                <Button onClick={handleAddTopic} disabled={!newTopic.trim()}>
                  <Plus className="h-4 w-4 mr-1" /> Ավելացնել
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Չեղարկել</Button>
          <Button onClick={onSave}>Պահպանել</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleDialog;
