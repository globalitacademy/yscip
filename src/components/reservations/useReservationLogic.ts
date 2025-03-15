
import { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectReservation } from '@/utils/reservationUtils';
import { toast } from '@/components/ui/use-toast';

export const useReservationLogic = () => {
  const { 
    projectReservations, 
    approveReservation, 
    rejectReservation, 
    reserveProject, 
    project, 
    isReserved, 
    openSupervisorDialog 
  } = useProject();
  const { user } = useAuth();
  const [selectedSupervisor, setSelectedSupervisor] = useState<string>("");
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [rejectProjectId, setRejectProjectId] = useState<string | null>(null);

  // Filter reservations based on user role
  const filteredReservations = projectReservations.filter(res => {
    if (!user) return false;
    
    if (user.role === 'admin') return true;
    
    if (user.role === 'student') {
      return res.userId === user.id;
    }
    
    if (user.role === 'supervisor' || user.role === 'project_manager') {
      return res.supervisorId === user.id;
    }
    
    if (user.role === 'instructor' || user.role === 'lecturer') {
      return res.instructorId === user.id;
    }
    
    return false;
  });

  const handleReserveProject = () => {
    openSupervisorDialog();
  };

  const handleRejectOpen = (reservationId: string) => {
    setRejectProjectId(reservationId);
    setRejectFeedback("");
  };

  const handleRejectConfirm = () => {
    if (rejectProjectId === null) return;
    
    rejectReservation(rejectProjectId, rejectFeedback);
    setRejectProjectId(null);
    setRejectFeedback("");
    
    toast({
      title: "Հարցումը մերժված է",
      description: "Ուսանողը կստանա ձեր մերժման պատճառը։",
    });
  };

  // Check if current user is an admin-like role that can approve/reject
  const isAdmin = user && (
    user.role === 'supervisor' || 
    user.role === 'project_manager' || 
    user.role === 'instructor' || 
    user.role === 'lecturer'
  );

  // Only students can reserve projects
  const canReserve = user?.role === 'student' && !isReserved && project;

  return {
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
  };
};
