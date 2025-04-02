
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
  const [isDirty, setIsDirty] = useState(false);
  
  // Reset active tab and isDirty when dialog opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('basic');
      setIsDirty(false);
      console.log('CourseEditDialog: Dialog opened with editedCourse:', editedCourse);
    }
  }, [isOpen, editedCourse]);
  
  // Handle form changes and track when form becomes dirty
  const handleFormChange = (changes: Partial<ProfessionalCourse>) => {
    console.log('CourseEditDialog: Form changed with:', changes);
    setEditedCourse(prevState => {
      // Create a deep merged copy to ensure we don't lose any nested properties
      const newState = JSON.parse(JSON.stringify({ ...prevState, ...changes }));
      console.log('CourseEditDialog: New state after changes:', newState);
      setIsDirty(true);
      return newState;
    });
  };
  
  const handleIconSelect = (iconName: string) => {
    handleFormChange({ iconName });
    setIsIconsOpen(false);
  };
  
  const onSave = async () => {
    console.log('CourseEditDialog: Save button clicked with edited course data:', editedCourse);
    
    // Ensure we have complete data for lessons, requirements, and outcomes
    const updatedCourse = { ...editedCourse };
    
    if (!updatedCourse.lessons) {
      updatedCourse.lessons = [];
      console.log('CourseEditDialog: Initializing empty lessons array');
    }
    
    if (!updatedCourse.requirements) {
      updatedCourse.requirements = [];
      console.log('CourseEditDialog: Initializing empty requirements array');
    }
    
    if (!updatedCourse.outcomes) {
      updatedCourse.outcomes = [];
      console.log('CourseEditDialog: Initializing empty outcomes array');
    }
    
    if (Object.keys(updatedCourse).length !== Object.keys(editedCourse).length) {
      console.log('CourseEditDialog: Updating editedCourse with complete data before save:', updatedCourse);
      setEditedCourse(updatedCourse);
    }
    
    await handleSaveChanges();
    setIsDirty(false);
  };
  
  // Confirmation dialog if form is dirty and user tries to close
  const handleClose = (value: boolean) => {
    if (value === false && isDirty) {
      if (confirm('Դուք ունեք չպահպանված փոփոխություններ: Իսկապե՞ս ցանկանում եք փակել:')) {
        setIsOpen(false);
      }
    } else {
      setIsOpen(value);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
              setEditedCourse={handleFormChange}
              isIconsOpen={isIconsOpen}
              setIsIconsOpen={setIsIconsOpen}
              handleIconSelect={handleIconSelect}
            />
            <div className="mt-4 flex items-center space-x-2">
              <Checkbox 
                id="is_public" 
                checked={editedCourse.is_public || false} 
                onCheckedChange={(checked) => {
                  console.log('CourseEditDialog: Visibility checkbox changed to:', checked);
                  handleFormChange({
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
              setEditedCourse={handleFormChange}
            />
          </TabsContent>
          
          <TabsContent value="requirements">
            <RequirementsTab 
              editedCourse={editedCourse}
              setEditedCourse={handleFormChange}
            />
          </TabsContent>
          
          <TabsContent value="outcomes">
            <OutcomesTab 
              editedCourse={editedCourse}
              setEditedCourse={handleFormChange}
            />
          </TabsContent>

          <TabsContent value="author">
            <AuthorTab 
              editedCourse={editedCourse}
              setEditedCourse={handleFormChange}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => handleClose(false)} disabled={loading}>Չեղարկել</Button>
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
