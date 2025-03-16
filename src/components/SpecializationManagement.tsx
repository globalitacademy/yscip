import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { SpecializationTable } from './SpecializationTable';
import { SpecializationDialog } from './SpecializationDialog';
import { useSpecializationManagement } from './useSpecializationManagement';
import ConfirmDatabaseAction from '@/components/ConfirmDatabaseAction';

const SpecializationManagement: React.FC = () => {
  const {
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
  } = useSpecializationManagement();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      <div className="flex justify-between items-center">
        <Button className="ml-auto gap-2" onClick={() => setOpenNewSpecialization(true)}>
          <PlusCircle size={16} />
          Ավելացնել մասնագիտացում
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Մասնագիտացումների ցանկ</CardTitle>
          <CardDescription>Համակարգում առկա բոլոր մասնագիտացումները</CardDescription>
        </CardHeader>
        <CardContent>
          <SpecializationTable
            specializations={specializations}
            onEditSpecialization={handleEditSpecialization}
            onDeleteSpecialization={handleDeleteSpecialization}
            openEditSpecialization={openEditSpecialization}
          />
        </CardContent>
      </Card>

      {/* New Specialization Dialog */}
      <SpecializationDialog
        isOpen={openNewSpecialization}
        onClose={() => setOpenNewSpecialization(false)}
        specializationData={newSpecialization}
        onSpecializationDataChange={setNewSpecialization}
        onSave={handleCreateSpecialization}
        title="Նոր մասնագիտացում"
        description="Ստեղծեք նոր մասնագիտացում համակարգում։"
      />

      {/* Edit Specialization Dialog */}
      <SpecializationDialog
        isOpen={!!openEditSpecialization}
        onClose={() => handleEditSpecialization('')}
        specializationData={newSpecialization}
        onSpecializationDataChange={setNewSpecialization}
        onSave={handleUpdateSpecialization}
        isEditMode={true}
        title="Խմբագրել մասնագիտացումը"
        description={`Փոփոխեք ${newSpecialization.name} մասնագիտացման տվյալները։`}
      />

      {/* Confirmation Dialog */}
      <ConfirmDatabaseAction
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmAction}
        title={confirmTitle}
        description={confirmDescription}
        isLoading={isConfirming}
      />
    </div>
  );
};

export default SpecializationManagement;
