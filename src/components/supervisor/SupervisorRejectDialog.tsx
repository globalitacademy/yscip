
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { ProjectReservation } from '@/types/project';

interface SupervisorRejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedReservation: ProjectReservation | null;
  rejectFeedback: string;
  setRejectFeedback: (feedback: string) => void;
  onReject: () => void;
}

const SupervisorRejectDialog: React.FC<SupervisorRejectDialogProps> = ({
  open,
  onOpenChange,
  selectedReservation,
  rejectFeedback,
  setRejectFeedback,
  onReject
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Մերժել հարցումը</DialogTitle>
          <DialogDescription>
            Գրեք մերժման պատճառը, որը կտեսնի ուսանողը։
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="Մերժման պատճառը..."
          value={rejectFeedback}
          onChange={(e) => setRejectFeedback(e.target.value)}
          className="min-h-[100px]"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Չեղարկել
          </Button>
          <Button
            variant="destructive"
            onClick={onReject}
            disabled={!rejectFeedback}
          >
            Մերժել հարցումը
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupervisorRejectDialog;
