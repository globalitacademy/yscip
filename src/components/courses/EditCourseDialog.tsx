
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Course } from './types';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockSpecializations } from './useCourseManagement';

interface EditCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course | null;
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  newModule: string;
  setNewModule: React.Dispatch<React.SetStateAction<string>>;
  handleAddModuleToEdit: () => void;
  handleRemoveModuleFromEdit: (index: number) => void;
  handleEditCourse: () => void;
}

const EditCourseDialog: React.FC<EditCourseDialogProps> = ({
  isOpen,
  onClose,
  selectedCourse,
  setSelectedCourse,
  newModule,
  setNewModule,
  handleAddModuleToEdit,
  handleRemoveModuleFromEdit,
  handleEditCourse
}) => {
  if (!selectedCourse) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleEditCourse();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Խմբագրել դասընթացը</DialogTitle>
          <DialogDescription>
            Փոփոխեք դասընթացի մանրամասները ստորև։ Պատրաստ լինելուն պես, սեղմեք «Պահպանել» կոճակը։
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Վերնագիր
              </Label>
              <Input
                id="edit-title"
                value={selectedCourse.title || ''}
                onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-description" className="text-right pt-2">
                Նկարագրություն
              </Label>
              <Textarea
                id="edit-description"
                value={selectedCourse.description || ''}
                onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })}
                className="col-span-3"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Գին (֏)
              </Label>
              <Input
                id="edit-price"
                value={selectedCourse.price || ''}
                onChange={(e) => setSelectedCourse({ ...selectedCourse, price: e.target.value })}
                className="col-span-3"
                placeholder="Օրինակ՝ 58,000"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-duration" className="text-right">
                Տևողություն
              </Label>
              <Input
                id="edit-duration"
                value={selectedCourse.duration || ''}
                onChange={(e) => setSelectedCourse({ ...selectedCourse, duration: e.target.value })}
                className="col-span-3"
                placeholder="Օրինակ՝ 3 ամիս"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-specialization" className="text-right">
                Մասնագիտացում
              </Label>
              <Select
                value={selectedCourse.specialization || ''}
                onValueChange={(value) => setSelectedCourse({ ...selectedCourse, specialization: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Ընտրեք մասնագիտացումը" />
                </SelectTrigger>
                <SelectContent>
                  {mockSpecializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-institution" className="text-right">
                Հաստատություն
              </Label>
              <Input
                id="edit-institution"
                value={selectedCourse.institution || ''}
                onChange={(e) => setSelectedCourse({ ...selectedCourse, institution: e.target.value })}
                className="col-span-3"
                placeholder="Օրինակ՝ Qolej"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Մոդուլներ
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newModule}
                    onChange={(e) => setNewModule(e.target.value)}
                    placeholder="Ավելացնել նոր մոդուլ"
                  />
                  <Button type="button" size="sm" onClick={handleAddModuleToEdit}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCourse.modules?.map((module, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                      {module}
                      <button
                        type="button"
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => handleRemoveModuleFromEdit(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Պահպանել</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDialog;
