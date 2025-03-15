
import React from 'react';
import { Button } from '@/components/ui/button';
import SupervisorSelectionDialog from '@/components/SupervisorSelectionDialog';
import ReservationStatusBadge from './ReservationStatusBadge';

interface ReservationActionsProps {
  reservationStatus: 'pending' | 'approved' | 'rejected' | null;
  openSupervisorDialog: () => void;
  closeSupervisorDialog: () => void;
  showSupervisorDialog: boolean;
  selectedSupervisor: string | null;
  selectSupervisor: (supervisorId: string) => void;
  reserveProject: () => void;
  projectTitle: string; // Added the missing projectTitle prop
}

const ReservationActions: React.FC<ReservationActionsProps> = ({
  reservationStatus,
  openSupervisorDialog,
  closeSupervisorDialog,
  showSupervisorDialog,
  selectedSupervisor,
  selectSupervisor,
  reserveProject,
  projectTitle
}) => {
  return (
    <div className="space-y-3">
      <ReservationStatusBadge status={reservationStatus} />
      
      {reservationStatus === 'rejected' && (
        <div className="text-red-500 text-sm mb-3">
          Ձեր հարցումը մերժվել է։ Դուք կարող եք կրկին փորձել այլ ղեկավարի հետ։
        </div>
      )}
      
      {(!reservationStatus || reservationStatus === 'rejected') && (
        <Button onClick={openSupervisorDialog} size="lg" className="mt-2">
          {reservationStatus === 'rejected' ? 'Կրկին փորձել' : 'Ամրագրել այս պրոեկտը'}
        </Button>
      )}
      
      {reservationStatus === 'pending' && (
        <p className="text-sm text-muted-foreground mt-2">
          Խնդրում ենք սպասել մինչև ղեկավարը հաստատի կամ մերժի ձեր հարցումը։
        </p>
      )}
      
      <SupervisorSelectionDialog
        isOpen={showSupervisorDialog}
        onClose={closeSupervisorDialog}
        onSelectSupervisor={selectSupervisor}
        onReserveProject={reserveProject}
        selectedSupervisor={selectedSupervisor}
        projectTitle={projectTitle}
      />
    </div>
  );
};

export default ReservationActions;
