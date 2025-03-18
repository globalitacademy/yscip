
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useGroupManagement } from './useGroupManagement';
import GroupCard from './GroupCard';
import AddGroupDialog from './AddGroupDialog';
import ViewGroupDialog from './ViewGroupDialog';

const GroupManagement: React.FC = () => {
  const { user } = useAuth();
  const {
    groups,
    isLoading,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    selectedGroup,
    newGroup,
    setNewGroup,
    availableStudents,
    selectedStudent,
    setSelectedStudent,
    handleAddGroup,
    handleViewGroup,
    handleAddStudent,
    handleRemoveStudent,
    handleDeleteGroup,
    getLecturerName,
    getStudentCount,
    getGroupStudents,
    getCourses,
    getLecturers
  } = useGroupManagement();

  const isAdmin = user?.role === 'admin';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Խմբերի կառավարում</h1>
        {isAdmin && (
          <AddGroupDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            newGroup={newGroup}
            setNewGroup={setNewGroup}
            getCourses={getCourses}
            getLecturers={getLecturers}
            onAddGroup={handleAddGroup}
          />
        )}
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Բազայում խմբեր չկան։ Ավելացրեք նոր խմբեր։</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              isAdmin={isAdmin}
              getLecturerName={getLecturerName}
              getStudentCount={getStudentCount}
              onViewGroup={handleViewGroup}
              onDeleteGroup={handleDeleteGroup}
            />
          ))}
        </div>
      )}

      {/* View Group Dialog */}
      <ViewGroupDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        selectedGroup={selectedGroup}
        getLecturerName={getLecturerName}
        getGroupStudents={getGroupStudents}
        availableStudents={availableStudents}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
        isAdmin={isAdmin}
        onAddStudent={handleAddStudent}
        onRemoveStudent={handleRemoveStudent}
      />
    </div>
  );
};

export default GroupManagement;
