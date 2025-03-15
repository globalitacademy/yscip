
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
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
              onChange={(e) => onModuleChange(prev => prev ? {...prev, title: e.target.value} : null)} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Նկարագրություն</Label>
            <Textarea 
              id="description" 
              value={selectedModule?.description || ''} 
              onChange={(e) => onModuleChange(prev => prev ? {...prev, description: e.target.value} : null)} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Կարգավիճակ</Label>
            <Select 
              value={selectedModule?.status || 'not-started'} 
              onValueChange={(value) => onModuleChange(prev => prev ? {...prev, status: value as 'not-started' | 'in-progress' | 'completed'} : null)}
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
              onChange={(e) => onModuleChange(prev => prev ? {...prev, progress: parseInt(e.target.value, 10)} : null)} 
            />
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
