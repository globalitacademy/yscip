
import { useState } from 'react';

export const useConfirmDialog = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() => async () => {});
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmDescription, setConfirmDescription] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  // Function to show confirmation dialog
  const showConfirm = (title: string, description: string, action: () => Promise<void>) => {
    setConfirmTitle(title);
    setConfirmDescription(description);
    setConfirmAction(() => action);
    setShowConfirmDialog(true);
  };

  return {
    showConfirmDialog,
    confirmTitle,
    confirmDescription,
    confirmAction,
    isConfirming,
    setShowConfirmDialog,
    setIsConfirming,
    showConfirm
  };
};
