
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Group } from './types';
import { User } from '@/types/user';

interface ViewGroupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGroup: Group | null;
  getLecturerName: (id: string) => string;
  getGroupStudents: (groupId: string) => User[];
  availableStudents: User[];
  selectedStudent: string;
  setSelectedStudent: React.Dispatch<React.SetStateAction<string>>;
  isAdmin: boolean;
  onAddStudent: () => Promise<void>;
  onRemoveStudent: (studentId: string) => Promise<void>;
}

const ViewGroupDialog: React.FC<ViewGroupDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedGroup,
  getLecturerName,
  getGroupStudents,
  availableStudents,
  selectedStudent,
  setSelectedStudent,
  isAdmin,
  onAddStudent,
  onRemoveStudent
}) => {
  if (!selectedGroup) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Խումբ: {selectedGroup.name}</DialogTitle>
          <DialogDescription>
            Կուրս: {selectedGroup.course} | Դասախոս: {getLecturerName(selectedGroup.lecturer_id)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <h3 className="font-semibold mb-2">Ուսանողներ</h3>
            {getGroupStudents(selectedGroup.id).length === 0 ? (
              <p className="text-sm text-muted-foreground">Այս խմբում դեռ ուսանողներ չկան</p>
            ) : (
              <div className="space-y-2">
                {getGroupStudents(selectedGroup.id).map(student => (
                  <div key={student.id} className="flex justify-between items-center p-2 bg-secondary/20 rounded-md">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive h-7 w-7" 
                        onClick={() => onRemoveStudent(student.id)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {isAdmin && (
            <div className="border rounded-md p-4">
              <h3 className="font-semibold mb-2">Ուսանողի ավելացում</h3>
              {availableStudents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Բոլոր ուսանողներն արդեն խմբում են</p>
              ) : (
                <div className="flex gap-2">
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Ընտրեք ուսանողին" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={onAddStudent} disabled={!selectedStudent}>Ավելացնել</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewGroupDialog;
