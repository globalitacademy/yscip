
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Course } from './types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockSpecializations } from './useCourseManagement';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CourseForm from './CourseForm';

interface AddCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newCourse: Partial<Course>;
  setNewCourse: React.Dispatch<React.SetStateAction<Partial<Course>>>;
  handleAddCourse: () => void;
  newModule: string;
  setNewModule: React.Dispatch<React.SetStateAction<string>>;
  handleAddModule: () => void;
  handleRemoveModule: (index: number) => void;
}

const AddCourseDialog: React.FC<AddCourseDialogProps> = ({
  isOpen,
  onClose,
  newCourse,
  setNewCourse,
  handleAddCourse,
  newModule,
  setNewModule,
  handleAddModule,
  handleRemoveModule
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddCourse();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Ավելացնել նոր դասընթաց</DialogTitle>
          <DialogDescription>
            Լրացրեք դասընթացի մանրամասները ստորև։ Պատրաստ լինելուն պես, սեղմեք «Ավելացնել» կոճակը։
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Վերնագիր
              </Label>
              <Input
                id="title"
                value={newCourse.title || ''}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Նկարագրություն
              </Label>
              <Textarea
                id="description"
                value={newCourse.description || ''}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                className="col-span-3"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Գին (֏)
              </Label>
              <Input
                id="price"
                value={newCourse.price || ''}
                onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                className="col-span-3"
                placeholder="Օրինակ՝ 58,000"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Տևողություն
              </Label>
              <Input
                id="duration"
                value={newCourse.duration || ''}
                onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                className="col-span-3"
                placeholder="Օրինակ՝ 3 ամիս"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialization" className="text-right">
                Մասնագիտացում
              </Label>
              <Select
                value={newCourse.specialization || ''}
                onValueChange={(value) => setNewCourse({ ...newCourse, specialization: value })}
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
              <Label htmlFor="institution" className="text-right">
                Հաստատություն
              </Label>
              <Input
                id="institution"
                value={newCourse.institution || ''}
                onChange={(e) => setNewCourse({ ...newCourse, institution: e.target.value })}
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
                  <Button type="button" size="sm" onClick={handleAddModule}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {newCourse.modules?.map((module, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                      {module}
                      <button
                        type="button"
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => handleRemoveModule(index)}
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
            <Button type="submit">Ավելացնել</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseDialog;
