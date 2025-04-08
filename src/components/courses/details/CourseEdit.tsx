
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { saveCourseChanges } from '../utils/course-operations/saveCourseChanges';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/hooks/use-theme';

// Import existing tab components that we'll use
import { 
  BasicInfoTab,
  LessonsTab,
  RequirementsTab,
  OutcomesTab,
  AuthorTab
} from '@/components/admin/courses/course-detail/tabs';

interface CourseEditProps {
  isOpen: boolean;
  onClose: () => void;
  course: ProfessionalCourse;
  onCourseUpdate: (updatedCourse: ProfessionalCourse) => void;
}

const CourseEdit: React.FC<CourseEditProps> = ({ 
  isOpen, 
  onClose, 
  course, 
  onCourseUpdate 
}) => {
  const [loading, setLoading] = useState(false);
  const [editedCourse, setEditedCourse] = useState<Partial<ProfessionalCourse>>({});
  const { theme } = useTheme();

  // Initialize editedCourse with the current course data
  useEffect(() => {
    if (course) {
      setEditedCourse(JSON.parse(JSON.stringify(course))); // Deep copy
    }
  }, [course, isOpen]);

  const handleSaveChanges = async () => {
    if (!editedCourse) return;
    
    setLoading(true);
    try {
      const completeEditedCourse = {
        ...course,
        ...editedCourse,
        lessons: editedCourse.lessons || course.lessons || [],
        requirements: editedCourse.requirements || course.requirements || [],
        outcomes: editedCourse.outcomes || course.outcomes || []
      };
      
      const success = await saveCourseChanges(completeEditedCourse as ProfessionalCourse);
      if (success) {
        toast.success('Դասընթացը հաջողությամբ թարմացվել է');
        onCourseUpdate(completeEditedCourse as ProfessionalCourse);
        onClose();
      } else {
        toast.error('Սխալ է տեղի ունեցել դասընթացը թարմացնելիս։');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('Սխալ է տեղի ունեցել դասընթացը թարմացնելիս։');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-6xl p-0 h-[90vh] ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}>
        <div className="h-full flex flex-col">
          {/* Edit controls */}
          <div className={`flex justify-between items-center p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b`}>
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
                variant={theme === 'dark' ? 'outline' : 'outline'}
                onClick={onClose}
                className={`flex items-center gap-2 ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'}`}
              >
                <X size={16} />
                Չեղարկել
              </Button>
            </div>
          </div>
          
          {/* Tabs content */}
          <ScrollArea className="flex-grow overflow-y-auto">
            <div className="p-6">
              <Tabs defaultValue="basic-info" className="w-full">
                <TabsList className={`mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <TabsTrigger value="basic-info" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white'}>Հիմնական տվյալներ</TabsTrigger>
                  <TabsTrigger value="lessons" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white'}>Դասընթացի պլան</TabsTrigger>
                  <TabsTrigger value="requirements" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white'}>Պահանջներ</TabsTrigger>
                  <TabsTrigger value="outcomes" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white'}>Արդյունքներ</TabsTrigger>
                  <TabsTrigger value="author" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white'}>Հեղինակի մասին</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic-info" className="focus-visible:outline-none">
                  <BasicInfoTab editedCourse={editedCourse} setEditedCourse={setEditedCourse} />
                </TabsContent>
                
                <TabsContent value="lessons" className="focus-visible:outline-none">
                  <LessonsTab editedCourse={editedCourse} setEditedCourse={setEditedCourse} />
                </TabsContent>
                
                <TabsContent value="requirements" className="focus-visible:outline-none">
                  <RequirementsTab editedCourse={editedCourse} setEditedCourse={setEditedCourse} />
                </TabsContent>
                
                <TabsContent value="outcomes" className="focus-visible:outline-none">
                  <OutcomesTab editedCourse={editedCourse} setEditedCourse={setEditedCourse} />
                </TabsContent>
                
                <TabsContent value="author" className="focus-visible:outline-none">
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

export default CourseEdit;
