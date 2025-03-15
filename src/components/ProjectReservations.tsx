
import React from 'react';
import { useReservationLogic } from './reservations/useReservationLogic';
import ReservationForm from './reservations/ReservationForm';
import ReservationList from './reservations/ReservationList';
import EmptyReservationState from './reservations/EmptyReservationState';
import RejectReservationDialog from './reservations/RejectReservationDialog';

const ProjectReservations: React.FC = () => {
  const {
    filteredReservations,
    selectedSupervisor,
    setSelectedSupervisor,
    selectedInstructor,
    setSelectedInstructor,
    rejectFeedback,
    setRejectFeedback,
    rejectProjectId,
    setRejectProjectId,
    handleReserveProject,
    handleRejectOpen,
    handleRejectConfirm,
    isAdmin,
    canReserve,
    approveReservation,
    user
  } = useReservationLogic();

  return (
    <div className="space-y-6">
      {canReserve && (
        <ReservationForm
          selectedSupervisor={selectedSupervisor}
          selectedInstructor={selectedInstructor}
          onSupervisorChange={setSelectedSupervisor}
          onInstructorChange={setSelectedInstructor}
          onReserveProject={handleReserveProject}
        />
      )}
      
      {filteredReservations.length > 0 && (
        <ReservationList
          reservations={filteredReservations}
          onApprove={approveReservation}
          onRejectOpen={handleRejectOpen}
          isAdmin={!!isAdmin}
          title="Պրոեկտների ամրագրումներ"
          description={user?.role === 'student' 
            ? "Ձեր ամրագրած պրոեկտները" 
            : "Ձեզ նշանակված ամրագրումները"}
        />
      )}
      
      {user?.role === 'student' && filteredReservations.length === 0 && (
        <EmptyReservationState
          title="Ամրագրումներ չկան"
          description="Դուք դեռ չեք ամրագրել որևէ պրոեկտ։ Ամրագրեք պրոեկտ՝ սկսելու համար:"
        />
      )}
      
      <RejectReservationDialog 
        rejectFeedback={rejectFeedback}
        setRejectFeedback={setRejectFeedback}
        onRejectConfirm={handleRejectConfirm}
        rejectProjectId={rejectProjectId}
        setRejectProjectId={setRejectProjectId}
      />
    </div>
  );
};

export default ProjectReservations;
