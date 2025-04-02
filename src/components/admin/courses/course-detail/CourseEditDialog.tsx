
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Checkbox } from '@/components/ui/checkbox';

// Import tab components
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { LessonsTab } from './tabs/LessonsTab';
import { RequirementsTab } from './tabs/RequirementsTab';
import { OutcomesTab } from './tabs/OutcomesTab';
import { AuthorTab } from './tabs/AuthorTab';

interface CourseEditDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
  handleSaveChanges: () => Promise<void>;
  loading: boolean;
}

const CourseEditDialog: React.FC<CourseEditDialogProps> = ({
  isOpen,
  setIsOpen,
  editedCourse,
  setEditedCourse,
  handleSaveChanges,
  loading
}) => {
  const [isIconsOpen, setIsIconsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Reset active tab when dialog opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('basic');
    }
  }, [isOpen]);
  
  const handleIconSelect = (iconName: string) => {
    setEditedCourse({...editedCourse, iconName});
    setIsIconsOpen(false);
  };
  
  const onSave = async () => {
    console.log('Save button clicked with edited course data:', editedCourse);
    await handleSaveChanges();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Խմբագրել դասընթացը</DialogTitle>
          <DialogDescription>
            Թարմացրեք դասընթացի տվյալները: Պահպանելուց հետո փոփոխությունները կհայտնվեն հանրային էջում:
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Հիմնական տվյալներ</TabsTrigger>
            <TabsTrigger value="lessons">Դասերի ցանկ</TabsTrigger>
            <TabsTrigger value="requirements">Պահանջներ</TabsTrigger>
            <TabsTrigger value="outcomes">Արդյունքներ</TabsTrigger>
            <TabsTrigger value="author">Հեղինակ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <BasicInfoTab 
              editedCourse={editedCourse}
              setEditedCourse={setEditedCourse}
              isIconsOpen={isIconsOpen}
              setIsIconsOpen={setIsIconsOpen}
              handleIconSelect={handleIconSelect}
            />
            <div className="mt-4 flex items-center space-x-2">
              <Checkbox 
                id="is_public" 
                checked={editedCourse.is_public || false} 
                onCheckedChange={(checked) => {
                  console.log('Checkbox changed to:', checked);
                  setEditedCourse({
                    ...editedCourse,
                    is_public: !!checked
                  });
                }}
              />
              <label 
                htmlFor="is_public" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Հրապարակել դասընթացը
              </label>
            </div>
          </TabsContent>
          
          <TabsContent value="lessons">
            <LessonsTab 
              editedCourse={editedCourse}
              setEditedCourse={setEditedCourse}
            />
          </TabsContent>
          
          <TabsContent value="requirements">
            <RequirementsTab 
              editedCourse={editedCourse}
              setEditedCourse={setEditedCourse}
            />
          </TabsContent>
          
          <TabsContent value="outcomes">
            <OutcomesTab 
              editedCourse={editedCourse}
              setEditedCourse={setEditedCourse}
            />
          </TabsContent>

          <TabsContent value="author">
            <AuthorTab 
              editedCourse={editedCourse}
              setEditedCourse={setEditedCourse}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Չեղարկել</Button>
          <Button onClick={onSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Պահպանել
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseEditDialog;
