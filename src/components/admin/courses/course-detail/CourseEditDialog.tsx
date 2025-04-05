
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, X } from 'lucide-react';
import CourseBanner from './CourseBanner';

// Import tabs
import { 
  BasicInfoTab,
  LessonsTab,
  RequirementsTab,
  OutcomesTab,
  AuthorTab
} from './tabs';

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
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DialogContent className="max-w-6xl p-0 h-[90vh] bg-white">
        <div className="h-full flex flex-col">
          {/* Course Banner at the top */}
          {editedCourse && (
            <CourseBanner course={editedCourse as ProfessionalCourse} isEditMode={true} />
          )}
          
          {/* Edit controls */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Դասընթացի խմբագրում</h2>
            <div className="flex gap-2">
              <Button 
                onClick={handleSaveChanges} 
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                Պահպանել փոփոխությունները
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Չեղարկել
              </Button>
            </div>
          </div>
          
          {/* Tabs content */}
          <ScrollArea className="flex-grow">
            <div className="p-6">
              <Tabs defaultValue="basic-info" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="basic-info">Հիմնական տվյալներ</TabsTrigger>
                  <TabsTrigger value="lessons">Դասընթացի պլան</TabsTrigger>
                  <TabsTrigger value="requirements">Պահանջներ</TabsTrigger>
                  <TabsTrigger value="outcomes">Արդյունքներ</TabsTrigger>
                  <TabsTrigger value="author">Հեղինակի մասին</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic-info">
                  <BasicInfoTab editedCourse={editedCourse} setEditedCourse={setEditedCourse} />
                </TabsContent>
                
                <TabsContent value="lessons">
                  <LessonsTab editedCourse={editedCourse} setEditedCourse={setEditedCourse} />
                </TabsContent>
                
                <TabsContent value="requirements">
                  <RequirementsTab editedCourse={editedCourse} setEditedCourse={setEditedCourse} />
                </TabsContent>
                
                <TabsContent value="outcomes">
                  <OutcomesTab editedCourse={editedCourse} setEditedCourse={setEditedCourse} />
                </TabsContent>
                
                <TabsContent value="author">
                  <AuthorTab editedCourse={editedCourse} setEditedCourse={setEditedCourse} />
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseEditDialog;
