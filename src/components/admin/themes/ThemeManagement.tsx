
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useThemeManagement } from './hooks/useThemeManagement';
import ThemeTable from './components/ThemeTable';
import ThemeDialog from './components/ThemeDialog';
import DeleteThemeDialog from './components/DeleteThemeDialog';

const ThemeManagement: React.FC = () => {
  const { 
    themes,
    isDialogOpen,
    selectedTheme,
    isDeleteDialogOpen,
    fetchThemes,
    setIsDialogOpen,
    setSelectedTheme,
    setIsDeleteDialogOpen,
    handleEditClick,
    handleDeleteClick,
    handleSaveTheme,
    handleDeleteTheme,
    handleAddNewTheme
  } = useThemeManagement();

  useEffect(() => {
    fetchThemes();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Կրթական թեմաների կառավարում</h1>
        <Button onClick={handleAddNewTheme}>
          <Plus className="mr-2 h-4 w-4" /> Ավելացնել թեմա
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Թեմաներ</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeTable 
            themes={themes}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        </CardContent>
      </Card>
      
      <ThemeDialog 
        open={isDialogOpen}
        selectedTheme={selectedTheme}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveTheme}
        onThemeChange={setSelectedTheme}
      />
      
      <DeleteThemeDialog 
        open={isDeleteDialogOpen}
        selectedTheme={selectedTheme}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteTheme}
      />
    </div>
  );
};

export default ThemeManagement;
