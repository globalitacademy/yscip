
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@/data/userRoles';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserFormFields } from './UserFormFields';

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userData: Partial<User>;
  onUserDataChange: (userData: Partial<User>) => void;
  onSave: () => void;
  isEditMode?: boolean;
  title: string;
  description: string;
  loading?: boolean;
}

export const UserDialog: React.FC<UserDialogProps> = ({
  isOpen,
  onClose,
  userData,
  onUserDataChange,
  onSave,
  isEditMode = false,
  title,
  description,
  loading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <UserFormFields 
            userData={userData} 
            onUserDataChange={onUserDataChange} 
            isEditMode={isEditMode}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Չեղարկել</Button>
          <Button onClick={onSave} disabled={loading}>
            {loading ? 
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full"></span>
                Պահպանում...
              </span> : 
              isEditMode ? 'Պահպանել' : 'Ստեղծել'
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
