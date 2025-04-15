
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Theme } from '../hooks/useThemeManagement';

interface DeleteThemeDialogProps {
  open: boolean;
  selectedTheme: Theme | null;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

const DeleteThemeDialog: React.FC<DeleteThemeDialogProps> = ({
  open,
  selectedTheme,
  onOpenChange,
  onDelete
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Համոզվա՞ծ եք, որ ցանկանում եք ջնջել այս թեման
          </AlertDialogTitle>
          <AlertDialogDescription>
            "{selectedTheme?.title}" թեման կջնջվի մշտապես: Այս գործողությունը հնարավոր չէ հետ շրջել:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Չեղարկել</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onDelete}
          >
            Ջնջել
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteThemeDialog;
