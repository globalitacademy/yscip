
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Specialization } from './SpecializationTable';

interface SpecializationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  specializationData: Specialization;
  onSpecializationDataChange: (data: Specialization) => void;
  onSave: () => void;
  isEditMode?: boolean;
  title: string;
  description: string;
}

export const SpecializationDialog: React.FC<SpecializationDialogProps> = ({
  isOpen,
  onClose,
  specializationData,
  onSpecializationDataChange,
  onSave,
  isEditMode = false,
  title,
  description
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onSpecializationDataChange({
      ...specializationData,
      [name]: value
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Անվանում
            </Label>
            <Input
              id="name"
              name="name"
              value={specializationData.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Նկարագրություն
            </Label>
            <Textarea
              id="description"
              name="description"
              value={specializationData.description}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Չեղարկել
          </Button>
          <Button onClick={onSave}>
            {isEditMode ? 'Պահպանել' : 'Ստեղծել'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
