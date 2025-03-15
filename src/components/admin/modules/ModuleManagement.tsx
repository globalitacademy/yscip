
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import ModuleTable from './components/ModuleTable';
import ModuleDialog from './components/ModuleDialog';
import DeleteModuleDialog from './components/DeleteModuleDialog';
import { useModuleManagement } from './hooks/useModuleManagement';

const ModuleManagement: React.FC = () => {
  const { 
    modules,
    isDialogOpen,
    selectedModule,
    isDeleteDialogOpen,
    setIsDialogOpen,
    setSelectedModule,
    setIsDeleteDialogOpen,
    handleEditClick,
    handleDeleteClick,
    handleSaveModule,
    handleDeleteModule,
    handleAddNewModule
  } = useModuleManagement();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ուսումնական մոդուլների կառավարում</h1>
        <Button onClick={handleAddNewModule}>
          <Plus className="mr-2 h-4 w-4" /> Ավելացնել մոդուլ
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ուսումնական մոդուլներ</CardTitle>
        </CardHeader>
        <CardContent>
          <ModuleTable 
            modules={modules}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        </CardContent>
      </Card>
      
      {/* Edit/Create Module Dialog */}
      <ModuleDialog 
        open={isDialogOpen}
        selectedModule={selectedModule}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveModule}
        onModuleChange={setSelectedModule}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteModuleDialog 
        open={isDeleteDialogOpen}
        selectedModule={selectedModule}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteModule}
      />
    </div>
  );
};

export default ModuleManagement;
