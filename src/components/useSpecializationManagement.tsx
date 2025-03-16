
import { useState, useCallback } from 'react';
import { Specialization } from './SpecializationTable';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// This would typically come from a database
const mockSpecializations: Specialization[] = [
  {
    id: '1',
    name: 'Արհեստական բանականություն',
    description: 'Ուսումնասիրում է AI ալգորիթմներ և մեքենայական ուսուցում',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Ցանցային անվտանգություն',
    description: 'Կենտրոնանում է համակարգիչային ցանցերի անվտանգության վրա',
    created_at: new Date().toISOString()
  }
];

export const useSpecializationManagement = () => {
  const [specializations, setSpecializations] = useState<Specialization[]>(mockSpecializations);
  const [loading, setLoading] = useState(false);
  const [openNewSpecialization, setOpenNewSpecialization] = useState(false);
  const [openEditSpecialization, setOpenEditSpecialization] = useState<string | null>(null);
  const [newSpecialization, setNewSpecialization] = useState<Specialization>({
    id: '',
    name: '',
    description: ''
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmDescription, setConfirmDescription] = useState('');
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() => Promise.resolve());
  const [isConfirming, setIsConfirming] = useState(false);

  const handleCreateSpecialization = useCallback(() => {
    if (!newSpecialization.name) {
      toast.error('Մասնագիտացման անվանումը պարտադիր է');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const specialization = {
        ...newSpecialization,
        id: uuidv4(),
        created_at: new Date().toISOString()
      };
      
      setSpecializations(prev => [...prev, specialization]);
      setOpenNewSpecialization(false);
      setNewSpecialization({
        id: '',
        name: '',
        description: ''
      });
      setLoading(false);
      toast.success('Մասնագիտացումը հաջողությամբ ստեղծվեց');
    }, 500);
  }, [newSpecialization]);

  const handleEditSpecialization = useCallback((id: string) => {
    if (id) {
      const specialization = specializations.find(s => s.id === id);
      if (specialization) {
        setNewSpecialization(specialization);
        setOpenEditSpecialization(id);
      }
    } else {
      setOpenEditSpecialization(null);
      setNewSpecialization({
        id: '',
        name: '',
        description: ''
      });
    }
  }, [specializations]);

  const handleUpdateSpecialization = useCallback(() => {
    if (!newSpecialization.name) {
      toast.error('Մասնագիտացման անվանումը պարտադիր է');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSpecializations(prev => 
        prev.map(s => s.id === newSpecialization.id ? newSpecialization : s)
      );
      setOpenEditSpecialization(null);
      setNewSpecialization({
        id: '',
        name: '',
        description: ''
      });
      setLoading(false);
      toast.success('Մասնագիտացումը հաջողությամբ թարմացվեց');
    }, 500);
  }, [newSpecialization]);

  const handleDeleteSpecialization = useCallback((id: string) => {
    const specialization = specializations.find(s => s.id === id);
    if (!specialization) return;

    setConfirmTitle('Հաստատեք ջնջումը');
    setConfirmDescription(`Դուք իսկապե՞ս ցանկանում եք ջնջել "${specialization.name}" մասնագիտացումը: Այս գործողությունը հետադարձելի չէ։`);
    
    setConfirmAction(() => async () => {
      setIsConfirming(true);
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setSpecializations(prev => prev.filter(s => s.id !== id));
          setShowConfirmDialog(false);
          setIsConfirming(false);
          toast.success('Մասնագիտացումը հաջողությամբ ջնջվեց');
          resolve();
        }, 500);
      });
    });
    
    setShowConfirmDialog(true);
  }, [specializations]);

  return {
    specializations,
    loading,
    openNewSpecialization,
    openEditSpecialization,
    newSpecialization,
    showConfirmDialog,
    confirmTitle,
    confirmDescription,
    confirmAction,
    isConfirming,
    setOpenNewSpecialization,
    setNewSpecialization,
    handleCreateSpecialization,
    handleEditSpecialization,
    handleUpdateSpecialization,
    handleDeleteSpecialization,
    setShowConfirmDialog
  };
};
