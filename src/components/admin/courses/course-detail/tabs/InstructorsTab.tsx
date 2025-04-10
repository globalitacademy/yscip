
import React, { useState } from 'react';
import { ProfessionalCourse, CourseInstructor } from '@/components/courses/types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Save, X } from 'lucide-react';
import { MediaUploader } from '@/components/courses/form-components/MediaUploader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { v4 as uuidv4 } from 'uuid';

interface InstructorsTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
}

export const InstructorsTab: React.FC<InstructorsTabProps> = ({ editedCourse, setEditedCourse }) => {
  const [newInstructor, setNewInstructor] = useState<Partial<CourseInstructor>>({
    name: '',
    title: '',
    bio: '',
    avatar_url: '',
  });
  
  const [editingInstructor, setEditingInstructor] = useState<{ index: number, instructor: CourseInstructor } | null>(null);
  
  const handleAddInstructor = () => {
    if (!newInstructor.name) return;
    
    const instructorToAdd: CourseInstructor = {
      id: uuidv4(), // Generate temporary ID for new instructor
      name: newInstructor.name || '',
      title: newInstructor.title || '',
      bio: newInstructor.bio || '',
      avatar_url: newInstructor.avatar_url || '',
      course_id: editedCourse.id || ''
    };
    
    const updatedInstructors = [...(editedCourse.instructors || []), instructorToAdd];
    setEditedCourse({ ...editedCourse, instructors: updatedInstructors });
    
    // Reset form
    setNewInstructor({
      name: '',
      title: '',
      bio: '',
      avatar_url: '',
    });
  };
  
  const handleRemoveInstructor = (index: number) => {
    const updatedInstructors = [...(editedCourse.instructors || [])];
    updatedInstructors.splice(index, 1);
    setEditedCourse({ ...editedCourse, instructors: updatedInstructors });
    
    // If we're editing this instructor, cancel editing
    if (editingInstructor && editingInstructor.index === index) {
      setEditingInstructor(null);
    }
  };
  
  const startEditingInstructor = (index: number) => {
    const instructor = (editedCourse.instructors || [])[index];
    if (instructor) {
      setEditingInstructor({ index, instructor });
    }
  };
  
  const handleEditInstructorChange = (field: keyof CourseInstructor, value: string) => {
    if (!editingInstructor) return;
    
    setEditingInstructor({
      ...editingInstructor,
      instructor: {
        ...editingInstructor.instructor,
        [field]: value
      }
    });
  };
  
  const saveEditedInstructor = () => {
    if (!editingInstructor) return;
    
    const updatedInstructors = [...(editedCourse.instructors || [])];
    updatedInstructors[editingInstructor.index] = editingInstructor.instructor;
    
    setEditedCourse({ ...editedCourse, instructors: updatedInstructors });
    setEditingInstructor(null);
  };
  
  const cancelEditing = () => {
    setEditingInstructor(null);
  };
  
  const handleAvatarChange = (url: string) => {
    if (editingInstructor) {
      handleEditInstructorChange('avatar_url', url);
    } else {
      setNewInstructor({ ...newInstructor, avatar_url: url });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Դասընթացի դասախոսներ</h3>
      
      {/* List of existing instructors */}
      <div className="space-y-4">
        {(editedCourse.instructors || []).map((instructor, index) => (
          <div key={instructor.id} className="border rounded-lg p-4 bg-card">
            {editingInstructor && editingInstructor.index === index ? (
              // Editing mode for this instructor
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="shrink-0 w-24">
                    <MediaUploader
                      mediaUrl={editingInstructor.instructor.avatar_url}
                      onMediaChange={handleAvatarChange}
                      label="Նկար"
                      uploadLabel="Ներբեռնել նկարը"
                      previewHeight="h-24 w-24 object-cover rounded-full"
                    />
                  </div>
                  
                  <div className="flex-grow space-y-3">
                    <div>
                      <Label htmlFor={`edit-name-${index}`}>Անուն</Label>
                      <Input
                        id={`edit-name-${index}`}
                        value={editingInstructor.instructor.name}
                        onChange={(e) => handleEditInstructorChange('name', e.target.value)}
                        placeholder="Դասախոսի անուն"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`edit-title-${index}`}>Պաշտոն</Label>
                      <Input
                        id={`edit-title-${index}`}
                        value={editingInstructor.instructor.title || ''}
                        onChange={(e) => handleEditInstructorChange('title', e.target.value)}
                        placeholder="Մասնագիտական պաշտոն"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`edit-bio-${index}`}>Կենսագրություն</Label>
                  <Textarea
                    id={`edit-bio-${index}`}
                    value={editingInstructor.instructor.bio || ''}
                    onChange={(e) => handleEditInstructorChange('bio', e.target.value)}
                    placeholder="Կարճ կենսագրություն"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline"
                    onClick={cancelEditing}
                    size="sm"
                  >
                    <X size={16} className="mr-1" /> Չեղարկել
                  </Button>
                  <Button 
                    onClick={saveEditedInstructor}
                    size="sm"
                  >
                    <Save size={16} className="mr-1" /> Պահպանել
                  </Button>
                </div>
              </div>
            ) : (
              // Display mode
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={instructor.avatar_url || ''} alt={instructor.name} />
                  <AvatarFallback>{instructor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-grow">
                  <h4 className="font-medium">{instructor.name}</h4>
                  {instructor.title && <p className="text-muted-foreground">{instructor.title}</p>}
                  {instructor.bio && <p className="mt-2 text-sm">{instructor.bio}</p>}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="ghost"
                    size="icon" 
                    onClick={() => startEditingInstructor(index)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                      <path d="m15 5 4 4"/>
                    </svg>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveInstructor(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {(editedCourse.instructors || []).length === 0 && (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground">Դեռ չկան ավելացված դասախոսներ</p>
          </div>
        )}
      </div>
      
      {/* Add new instructor form */}
      <div className="border rounded-lg p-4 space-y-4 mt-6">
        <h4 className="font-medium">Ավելացնել նոր դասախոս</h4>
        
        <div className="flex gap-4">
          <div className="shrink-0 w-24">
            <MediaUploader
              mediaUrl={newInstructor.avatar_url}
              onMediaChange={handleAvatarChange}
              label="Նկար"
              uploadLabel="Ներբեռնել նկարը"
              previewHeight="h-24 w-24 object-cover rounded-full"
            />
          </div>
          
          <div className="flex-grow space-y-3">
            <div>
              <Label htmlFor="new-name">Անուն</Label>
              <Input
                id="new-name"
                value={newInstructor.name || ''}
                onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                placeholder="Դասախոսի անուն"
              />
            </div>
            
            <div>
              <Label htmlFor="new-title">Պաշտոն</Label>
              <Input
                id="new-title"
                value={newInstructor.title || ''}
                onChange={(e) => setNewInstructor({ ...newInstructor, title: e.target.value })}
                placeholder="Մասնագիտական պաշտոն"
              />
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="new-bio">Կենսագրություն</Label>
          <Textarea
            id="new-bio"
            value={newInstructor.bio || ''}
            onChange={(e) => setNewInstructor({ ...newInstructor, bio: e.target.value })}
            placeholder="Կարճ կենսագրություն"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleAddInstructor} 
            disabled={!newInstructor.name}
          >
            <Plus size={16} className="mr-1" /> Ավելացնել դասախոս
          </Button>
        </div>
      </div>
    </div>
  );
};
