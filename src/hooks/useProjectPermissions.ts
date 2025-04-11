
import { useState, useEffect } from 'react';

/**
 * Custom hook to determine project-related permissions based on user role
 * @param role The user's role
 */
export const useProjectPermissions = (role?: string | null) => {
  // Define all possible permissions
  return {
    canCreateProjects: role === 'admin' || role === 'lecturer' || role === 'employer',
    canEditProjects: role === 'admin' || role === 'lecturer' || role === 'employer',
    canDeleteProjects: role === 'admin',
    canReserveProjects: role === 'student',
    canSubmitProject: role === 'student',
    canApproveProject: role === 'supervisor' || role === 'lecturer' || role === 'admin',
    canAddTimeline: role === 'admin' || role === 'lecturer' || role === 'supervisor',
    canApproveTimelineEvents: role === 'admin' || role === 'lecturer' || role === 'supervisor',
    canAddTasks: role === 'admin' || role === 'lecturer' || role === 'supervisor', 
    canAssignTasks: role === 'admin' || role === 'lecturer' || role === 'supervisor',
    canManageInstructors: role === 'admin',
    canViewStats: role === 'admin' || role === 'lecturer',
    canViewReservations: role === 'admin' || role === 'lecturer' || role === 'supervisor'
  };
};
