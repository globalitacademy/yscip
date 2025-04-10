
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, X } from 'lucide-react';
import CourseBanner from './CourseBanner';
import { useTheme } from '@/hooks/use-theme';

// Import tabs
import { 
  BasicInfoTab,
  LessonsTab,
  RequirementsTab,
  OutcomesTab,
  AuthorTab,
  DisplaySettingsTab,
  InstructorsTab // Added InstructorsTab import
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
  const { theme } = useTheme();
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DialogContent className={`max-w-6xl p-0 h-[90vh] overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="h-full flex flex-col">
          {/* Course Banner at the top */}
          {editedCourse && (
            <div className="shrink-0">
              <CourseBanner course={editedCourse as ProfessionalCourse} isEditMode={true} />
            </div>
          )}
          
          {/* Edit controls */}
          <div className={`flex justify-between items-center p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b shrink-0`}>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Դասընթացի խմբագրում</h2>
            <div className="flex gap-2">
              <Button 
                onClick={handleSaveChanges} 
                disabled={loading}
                className={`flex items-center gap-2 ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                <Save size={16} />
                Պահպանել փոփոխությունները
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 ${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : ''}`}
              >
                <X size={16} />
                Չեղարկել
              </Button>
            </div>
          </div>
          
          {/* Tabs content with ScrollArea for scrolling */}
          <div className="flex-grow overflow-hidden">
            <Tabs defaultValue="basic-info" className="w-full h-full flex flex-col">
              <div className="px-6 pt-6 shrink-0">
                <TabsList className={`mb-6 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
                  <TabsTrigger value="basic-info" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-300' : ''}>
                    Հիմնական տվյալներ
                  </TabsTrigger>
                  <TabsTrigger value="display-settings" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-300' : ''}>
                    Ցուցադրման կարգավորումներ
                  </TabsTrigger>
                  <TabsTrigger value="instructors" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-300' : ''}>
                    Դասախոսներ
                  </TabsTrigger>
                  <TabsTrigger value="lessons" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-300' : ''}>
                    Դասընթացի պլան
                  </TabsTrigger>
                  <TabsTrigger value="requirements" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-300' : ''}>
                    Պահանջներ
                  </TabsTrigger>
                  <TabsTrigger value="outcomes" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-300' : ''}>
                    Արդյունքներ
                  </TabsTrigger>
                  <TabsTrigger value="author" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-300' : ''}>
                    Հեղինակի մասին
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <ScrollArea className="px-6 flex-grow h-[calc(90vh-250px)]">
                <div className="pb-8">
                  <TabsContent value="basic-info" className="mt-0">
                    <BasicInfoTab editedCourse={editedCourse} setEditedCourse={setEditedCourse} />
                  </TabsContent>
                  
                  <TabsContent value="display-settings" className="mt-0">
                    <DisplaySettingsTab editedCourse={editedCourse} setEditedCourse={setEditedCourse} />
                  </TabsContent>
                  
                  <TabsContent value="instructors" className="mt-0">
                    <InstructorsTab editedCourse={editedCourse} setEditedCourse={setEditedCourse} />
                  </TabsContent>
                  
                  <TabsContent value="lessons" className="mt-0">
                    <LessonsTab editedCourse={editedCourse} setEditedCourse={setEditedCourse} />
                  </TabsContent>
                  
                  <TabsContent value="requirements" className="mt-0">
                    <RequirementsTab editedCourse={editedCourse} setEditedCourse={setEditedCourse} />
                  </TabsContent>
                  
                  <TabsContent value="outcomes" className="mt-0">
                    <OutcomesTab editedCourse={editedCourse} setEditedCourse={setEditedCourse} />
                  </TabsContent>
                  
                  <TabsContent value="author" className="mt-0">
                    <AuthorTab editedCourse={editedCourse} setEditedCourse={setEditedCourse} />
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseEditDialog;
