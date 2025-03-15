
import React from 'react';
import { ProjectReservation } from '@/types/project';
import { getUsersByRole } from '@/data/userRoles';
import { User } from '@/types/user';
import SupervisorPendingReservation from './SupervisorPendingReservation';
import SupervisorEmptyState from './SupervisorEmptyState';
import { MessageSquare } from 'lucide-react';

interface SupervisorRequestsTabProps {
  pendingReservations: ProjectReservation[];
  onApprove: (reservation: ProjectReservation) => void;
  onReject: (reservation: ProjectReservation) => void;
}

const SupervisorRequestsTab: React.FC<SupervisorRequestsTabProps> = ({
  pendingReservations,
  onApprove,
  onReject
}) => {
  // Get student users for displaying student info
  const students = getUsersByRole('student');
  
  // Get student info by ID
  const getStudentInfo = (studentId: string): User | undefined => {
    return students.find(student => student.id === studentId);
  };
  
  if (pendingReservations.length === 0) {
    return (
      <SupervisorEmptyState 
        icon={<MessageSquare className="h-12 w-12" />}
        title="Չկան սպասող հարցումներ"
        description="Այս պահին չկան սպասող հարցումներ։ Երբ ուսանողները ընտրեն ձեզ որպես իրենց նախագծի ղեկավար, դուք կստանաք ծանուցում։"
      />
    );
  }
  
  return (
    <div>
      {pendingReservations.map(reservation => (
        <SupervisorPendingReservation
          key={`${reservation.projectId}-${reservation.userId}`}
          reservation={reservation}
          student={getStudentInfo(reservation.userId)}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  );
};

export default SupervisorRequestsTab;
