
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { UserTable } from './UserTable';
import { UserDialog } from './UserDialog';
import { useUserManagement } from './useUserManagement';

interface UserManagementProps {
  // Props can be added if needed
}

const UserManagement: React.FC<UserManagementProps> = () => {
  const {
    users,
    loading,
    openNewUser,
    openEditUser,
    newUser,
    supervisors,
    setOpenNewUser,
    setNewUser,
    handleCreateUser,
    handleEditUser,
    handleUpdateUser,
    handleAssignSupervisor,
    handleDeleteUser
  } = useUserManagement();

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
        <h2 className="text-2xl font-bold">Օգտատերերի կառավարում</h2>
        <Button className="gap-2" onClick={() => setOpenNewUser(true)}>
          <UserPlus size={16} />
          Ավելացնել օգտատեր
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Օգտատերերի ցանկ</CardTitle>
          <CardDescription>Համակարգում գրանցված բոլոր օգտատերերը</CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable
            users={users}
            supervisors={supervisors}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onAssignSupervisor={handleAssignSupervisor}
            openEditUser={openEditUser}
          />
        </CardContent>
      </Card>

      {/* New User Dialog */}
      <UserDialog 
        isOpen={openNewUser}
        onClose={() => setOpenNewUser(false)}
        userData={newUser}
        onUserDataChange={setNewUser}
        onSave={handleCreateUser}
        title="Նոր օգտատեր"
        description="Ստեղծեք նոր օգտատեր համակարգում։"
      />

      {/* Edit User Dialog */}
      <UserDialog 
        isOpen={!!openEditUser}
        onClose={() => handleEditUser('')}
        userData={newUser}
        onUserDataChange={setNewUser}
        onSave={handleUpdateUser}
        isEditMode={true}
        title="Խմբագրել օգտատիրոջը"
        description={`Փոփոխեք ${newUser.name} օգտատիրոջ տվյալները։`}
      />
    </div>
  );
};

export default UserManagement;
