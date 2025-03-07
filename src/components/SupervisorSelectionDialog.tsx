
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCheck, Mail, AlertTriangle } from "lucide-react";
import { getAvailableSupervisors } from "@/utils/projectUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SupervisorSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSupervisor: (supervisorId: string) => void;
  onReserveProject: () => void;
  selectedSupervisor: string | null;
  projectTitle: string;
}

const SupervisorSelectionDialog: React.FC<SupervisorSelectionDialogProps> = ({
  isOpen,
  onClose,
  onSelectSupervisor,
  onReserveProject,
  selectedSupervisor,
  projectTitle
}) => {
  const supervisors = getAvailableSupervisors();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReserveProject();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ընտրեք ղեկավար</DialogTitle>
          <DialogDescription>
            Ընտրեք ղեկավար "{projectTitle}" նախագծի համար։ Ձեր հարցումը կուղարկվի ղեկավարին հաստատման նպատակով։
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex items-center gap-2 mb-4 text-amber-600 bg-amber-50 p-3 rounded-md">
            <AlertTriangle size={16} />
            <p className="text-sm">Նախագիծը կամրագրվի միայն ղեկավարի հաստատումից հետո</p>
          </div>
          
          <ScrollArea className="h-60 rounded-md border p-2">
            <RadioGroup
              value={selectedSupervisor || ''}
              onValueChange={onSelectSupervisor}
              className="space-y-3"
            >
              {supervisors.map((supervisor) => (
                <div key={supervisor.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                  <RadioGroupItem value={supervisor.id} id={supervisor.id} />
                  <Label htmlFor={supervisor.id} className="flex-1 flex items-center cursor-pointer">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={supervisor.avatar} alt={supervisor.name} />
                      <AvatarFallback>{supervisor.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{supervisor.name}</p>
                      <p className="text-sm text-muted-foreground">Ղեկավար</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </ScrollArea>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Չեղարկել
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedSupervisor}
              className="gap-2"
            >
              <Mail size={16} />
              Ուղարկել հարցումը
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SupervisorSelectionDialog;
