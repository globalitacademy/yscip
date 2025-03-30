
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, UserCircle, Link, Upload } from 'lucide-react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { IconSelector } from '@/components/courses/form-components/IconSelector';
import { LessonsList } from '@/components/courses/form-components/LessonsList';
import { RequirementsList } from '@/components/courses/form-components/RequirementsList';
import { OutcomesList } from '@/components/courses/form-components/OutcomesList';

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
  const [newLesson, setNewLesson] = useState({ title: '', duration: '' });
  const [newRequirement, setNewRequirement] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [logoOption, setLogoOption] = useState(editedCourse.organizationLogo ? 'url' : 'upload');
  
  const handleAddLesson = (newLesson) => {
    const lessons = [...(editedCourse.lessons || []), newLesson];
    setEditedCourse({ ...editedCourse, lessons });
  };

  const handleRemoveLesson = (index) => {
    const lessons = [...(editedCourse.lessons || [])];
    lessons.splice(index, 1);
    setEditedCourse({ ...editedCourse, lessons });
  };

  const handleAddRequirement = (requirement) => {
    const requirements = [...(editedCourse.requirements || []), requirement];
    setEditedCourse({ ...editedCourse, requirements });
  };

  const handleRemoveRequirement = (index) => {
    const requirements = [...(editedCourse.requirements || [])];
    requirements.splice(index, 1);
    setEditedCourse({ ...editedCourse, requirements });
  };

  const handleAddOutcome = (outcome) => {
    const outcomes = [...(editedCourse.outcomes || []), outcome];
    setEditedCourse({ ...editedCourse, outcomes });
  };

  const handleRemoveOutcome = (index) => {
    const outcomes = [...(editedCourse.outcomes || [])];
    outcomes.splice(index, 1);
    setEditedCourse({ ...editedCourse, outcomes });
  };

  const handleIconSelect = (iconName) => {
    setEditedCourse({...editedCourse, iconName});
    setIsIconsOpen(false);
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedCourse({ ...editedCourse, organizationLogo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
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
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Վերնագիր</Label>
                <Input 
                  id="title" 
                  value={editedCourse.title || ''} 
                  onChange={(e) => setEditedCourse({...editedCourse, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Ենթավերնագիր</Label>
                <Input 
                  id="subtitle" 
                  value={editedCourse.subtitle || ''} 
                  onChange={(e) => setEditedCourse({...editedCourse, subtitle: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Տևողություն</Label>
                <Input 
                  id="duration" 
                  value={editedCourse.duration || ''} 
                  onChange={(e) => setEditedCourse({...editedCourse, duration: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Գին</Label>
                <Input 
                  id="price" 
                  value={editedCourse.price || ''} 
                  onChange={(e) => setEditedCourse({...editedCourse, price: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Նկարի URL</Label>
                <Input 
                  id="imageUrl" 
                  value={editedCourse.imageUrl || ''} 
                  onChange={(e) => setEditedCourse({...editedCourse, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="institution">Հաստատություն</Label>
                <Input 
                  id="institution" 
                  value={editedCourse.institution || ''} 
                  onChange={(e) => setEditedCourse({...editedCourse, institution: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Պատկերակ</Label>
              <IconSelector 
                isIconsOpen={isIconsOpen}
                setIsIconsOpen={setIsIconsOpen}
                onIconSelect={handleIconSelect}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Նկարագրություն</Label>
              <Textarea 
                id="description" 
                value={editedCourse.description || ''} 
                onChange={(e) => setEditedCourse({...editedCourse, description: e.target.value})}
                rows={5}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="lessons">
            <LessonsList 
              lessons={editedCourse.lessons || []}
              onAddLesson={handleAddLesson}
              onRemoveLesson={handleRemoveLesson}
            />
          </TabsContent>
          
          <TabsContent value="requirements">
            <RequirementsList 
              requirements={editedCourse.requirements || []}
              onAddRequirement={handleAddRequirement}
              onRemoveRequirement={handleRemoveRequirement}
            />
          </TabsContent>
          
          <TabsContent value="outcomes">
            <OutcomesList 
              outcomes={editedCourse.outcomes || []}
              onAddOutcome={handleAddOutcome}
              onRemoveOutcome={handleRemoveOutcome}
            />
          </TabsContent>

          <TabsContent value="author" className="space-y-4">
            <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <UserCircle className="h-6 w-6 text-amber-700" />
                <h3 className="font-semibold text-amber-800">Հեղինակի տվյալներ</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="createdBy">Հեղինակի անուն</Label>
                  <Input 
                    id="createdBy" 
                    value={editedCourse.createdBy || ''} 
                    onChange={(e) => setEditedCourse({...editedCourse, createdBy: e.target.value})}
                    placeholder="Օր․՝ Անի Հովհաննիսյան"
                    className="bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instructorTitle">Հեղինակի պաշտոն (ըստ ցանկության)</Label>
                  <Input 
                    id="instructorTitle" 
                    value={editedCourse.instructor || ''} 
                    onChange={(e) => setEditedCourse({...editedCourse, instructor: e.target.value})}
                    placeholder="Օր․՝ Ավագ դասախոս"
                    className="bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Կազմակերպության լոգո</Label>
                  <Tabs value={logoOption} onValueChange={setLogoOption} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">Ներբեռնել</TabsTrigger>
                      <TabsTrigger value="url">URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload">
                      <div className="border rounded-md p-4 text-center bg-white">
                        <label htmlFor="logoUpload" className="cursor-pointer flex flex-col items-center">
                          <Upload className="h-8 w-8 mb-2 text-amber-700" />
                          <span>Ներբեռնել լոգո</span>
                          <input
                            id="logoUpload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoUpload}
                          />
                        </label>
                        {editedCourse.organizationLogo && (
                          <div className="mt-4">
                            <img 
                              src={editedCourse.organizationLogo} 
                              alt="Organization Logo Preview" 
                              className="max-h-20 mx-auto"
                            />
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="url">
                      <div className="border rounded-md p-4 bg-white">
                        <div className="flex items-center">
                          <Link className="h-5 w-5 mr-2 text-amber-700" />
                          <Input
                            value={editedCourse.organizationLogo || ''}
                            onChange={(e) => setEditedCourse({...editedCourse, organizationLogo: e.target.value})}
                            placeholder="https://example.com/logo.jpg"
                            className="bg-white"
                          />
                        </div>
                        {editedCourse.organizationLogo && (
                          <div className="mt-4">
                            <img 
                              src={editedCourse.organizationLogo} 
                              alt="Organization Logo Preview" 
                              className="max-h-20 mx-auto"
                            />
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
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
