
import { useState } from 'react';
import { ConfirmDialogState } from '../types/dialogStates';

export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>({
    showConfirmDialog: false,
    confirmTitle: '',
    confirmDescription: '',
    confirmAction: async () => {},
    isConfirming: false
  });

  // Function to show confirmation dialog
  const showConfirm = (title: string, description: string, action: () => Promise<void>) => {
    setDialogState({
      ...dialogState,
      confirmTitle: title,
      confirmDescription: description,
      confirmAction: action,
      showConfirmDialog: true
    });
  };

  const setShowConfirmDialog = (show: boolean) => {
    setDialogState({
      ...dialogState,
      showConfirmDialog: show
    });
  };

  const setIsConfirming = (confirming: boolean) => {
    setDialogState({
      ...dialogState,
      isConfirming: confirming
    });
  };

  return {
    ...dialogState,
    setShowConfirmDialog,
    setIsConfirming,
    showConfirm
  };
};
