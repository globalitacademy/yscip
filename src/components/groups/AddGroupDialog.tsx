
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types/user';
import { NewGroupData } from './types';

interface AddGroupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newGroup: NewGroupData;
  setNewGroup: React.Dispatch<React.SetStateAction<NewGroupData>>;
  getCourses: () => string[];
  getLecturers: () => User[];
  onAddGroup: () => Promise<void>;
}

const AddGroupDialog: React.FC<AddGroupDialogProps> = ({
  isOpen,
  onOpenChange,
  newGroup,
  setNewGroup,
  getCourses,
  getLecturers,
  onAddGroup
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Ավելացնել նոր խումբ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Նոր խմբի ավելացում</DialogTitle>
          <DialogDescription>
            Լրացրեք խմբի տվյալները ներքևում: Պատրաստ լինելուց հետո սեղմեք "Ավելացնել" կոճակը:
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Խմբի անուն
            </Label>
            <Input
              id="name"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              className="col-span-3"
              placeholder="Օր. ԿՄ-021"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="course" className="text-right">
              Կուրս
            </Label>
            <Select 
              value={newGroup.course} 
              onValueChange={(value) => setNewGroup({ ...newGroup, course: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Ընտրեք կուրսը" />
              </SelectTrigger>
              <SelectContent>
                {getCourses().map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lecturer" className="text-right">
              Դասախոս
            </Label>
            <Select 
              value={newGroup.lecturer_id} 
              onValueChange={(value) => setNewGroup({ ...newGroup, lecturer_id: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Ընտրեք դասախոսին" />
              </SelectTrigger>
              <SelectContent>
                {getLecturers().map((lecturer) => (
                  <SelectItem key={lecturer.id} value={lecturer.id}>
                    {lecturer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onAddGroup}>
            Ավելացնել
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGroupDialog;
