
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';

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
  
  const handleIconSelect = (iconName: string) => {
    setEditedCourse({...editedCourse, iconName});
    setIsIconsOpen(false);
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
        
        <Tabs defaultValue="basic">
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
          <Button onClick={handleSaveChanges} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Պահպանել
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseEditDialog;
