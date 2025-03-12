
import React from 'react';
import { User } from '@/data/userRoles';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';

interface AssignSupervisorDialogProps {
  studentId: string;
  studentName: string;
  supervisors: User[];
  onAssignSupervisor: (studentId: string, supervisorId: string) => void;
}

export const AssignSupervisorDialog: React.FC<AssignSupervisorDialogProps> = ({
  studentId,
  studentName,
  supervisors,
  onAssignSupervisor,
}) => {
  const [selectedSupervisor, setSelectedSupervisor] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAssign = () => {
    if (selectedSupervisor) {
      onAssignSupervisor(studentId, selectedSupervisor);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Նշանակել ղեկավար">
          <Users size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ղեկավարի նշանակում</DialogTitle>
          <DialogDescription>
            Ընտրեք ղեկավար {studentName} ուսանողի համար։
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select 
            value={selectedSupervisor} 
            onValueChange={setSelectedSupervisor}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ընտրեք ղեկավար" />
            </SelectTrigger>
            <SelectContent>
              {supervisors.map(supervisor => (
                <SelectItem key={supervisor.id} value={supervisor.id}>
                  {supervisor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Չեղարկել</Button>
          <Button onClick={handleAssign} disabled={!selectedSupervisor}>Նշանակել</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
