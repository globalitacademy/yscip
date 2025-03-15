
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RejectReservationDialogProps {
  rejectFeedback: string;
  setRejectFeedback: (feedback: string) => void;
  onRejectConfirm: () => void;
  rejectProjectId: string | null;
  setRejectProjectId: (id: string | null) => void;
}

const RejectReservationDialog: React.FC<RejectReservationDialogProps> = ({
  rejectFeedback,
  setRejectFeedback,
  onRejectConfirm,
  rejectProjectId,
  setRejectProjectId
}) => {
  const open = rejectProjectId !== null;
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && setRejectProjectId(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ամրագրման մերժում</DialogTitle>
          <DialogDescription>
            Մուտքագրեք մերժման պատճառը ուսանողին տեղեկացնելու համար:
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Մերժման պատճառը..."
            value={rejectFeedback}
            onChange={(e) => setRejectFeedback(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setRejectProjectId(null)}>Չեղարկել</Button>
          <Button variant="destructive" onClick={onRejectConfirm}>Մերժել ամրագրումը</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectReservationDialog;
