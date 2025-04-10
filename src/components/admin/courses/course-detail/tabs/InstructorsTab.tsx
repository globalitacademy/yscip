import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfessionalCourse, CourseInstructor } from '@/components/courses/types/ProfessionalCourse';
import { Plus, Trash2, UserPlus, User, Image, Upload } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

interface InstructorsTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
}

export const InstructorsTab: React.FC<InstructorsTabProps> = ({
  editedCourse,
  setEditedCourse
}) => {
  const [tempAvatar, setTempAvatar] = useState<string>('');
  const [editingInstructorId, setEditingInstructorId] = useState<string | null>(null);

  // Initialize instructors array if it doesn't exist
  const instructors: CourseInstructor[] = editedCourse.instructors || [];

  // Add a new instructor
  const handleAddInstructor = () => {
    const newInstructor: CourseInstructor = {
      id: uuidv4(),
      name: '',
      title: '',
      bio: '',
      avatar_url: '',
      course_id: editedCourse.id || ''
    };
    
    setEditedCourse({
      ...editedCourse,
      instructors: [...instructors, newInstructor],
      // Also update the instructor_ids array to keep them in sync
      instructor_ids: [...(editedCourse.instructor_ids || []), newInstructor.id]
    });
    
    setEditingInstructorId(newInstructor.id);
  };

  // Remove an instructor
  const handleRemoveInstructor = (id: string) => {
    const updatedInstructors = instructors.filter(instructor => instructor.id !== id);
    const updatedInstructorIds = (editedCourse.instructor_ids || []).filter(
      instructorId => instructorId !== id
    );
    
    setEditedCourse({
      ...editedCourse,
      instructors: updatedInstructors,
      instructor_ids: updatedInstructorIds
    });
    
    if (editingInstructorId === id) {
      setEditingInstructorId(null);
    }
  };

  // Update an instructor's data
  const handleInstructorUpdate = (id: string, field: keyof CourseInstructor, value: any) => {
    const updatedInstructors = instructors.map(instructor => {
      if (instructor.id === id) {
        return { ...instructor, [field]: value };
      }
      return instructor;
    });
    
    setEditedCourse({
      ...editedCourse,
      instructors: updatedInstructors
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Դասընթացի դասախոսներ</h3>
        <Button 
          onClick={handleAddInstructor} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <UserPlus size={16} />
          Ավելացնել դասախոս
        </Button>
      </div>
      
      {instructors.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-md">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Դեռ չկան դասախոսներ այս դասընթացի համար</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4 flex items-center gap-2 mx-auto"
            onClick={handleAddInstructor}
          >
            <UserPlus size={16} />
            Ավելացնել դասախոս
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {instructors.map((instructor) => (
            <div 
              key={instructor.id} 
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={instructor.avatar_url || ''} 
                      alt={instructor.name} 
                    />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {instructor.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{instructor.name || 'Նոր դասախոս'}</h4>
                    <p className="text-sm text-muted-foreground">{instructor.title || ''}</p>
                  </div>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingInstructorId(editingInstructorId === instructor.id ? null : instructor.id)}
                  >
                    {editingInstructorId === instructor.id ? 'Փակել' : 'Խմբագրել'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleRemoveInstructor(instructor.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              
              {editingInstructorId === instructor.id && (
                <div className="space-y-4 pt-3 border-t mt-3">
                  <div>
                    <Label htmlFor={`name-${instructor.id}`} className="font-medium">Անուն Ազգանուն</Label>
                    <Input
                      id={`name-${instructor.id}`}
                      value={instructor.name}
                      onChange={(e) => handleInstructorUpdate(instructor.id, 'name', e.target.value)}
                      placeholder="Դասախոսի անունը"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`title-${instructor.id}`} className="font-medium">Պաշտոն</Label>
                    <Input
                      id={`title-${instructor.id}`}
                      value={instructor.title || ''}
                      onChange={(e) => handleInstructorUpdate(instructor.id, 'title', e.target.value)}
                      placeholder="Պաշտոն կամ մասնագիտություն"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`bio-${instructor.id}`} className="font-medium">Կենսագրություն</Label>
                    <Textarea
                      id={`bio-${instructor.id}`}
                      value={instructor.bio || ''}
                      onChange={(e) => handleInstructorUpdate(instructor.id, 'bio', e.target.value)}
                      placeholder="Դասախոսի մասին համառոտ տեղեկություն"
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`avatar-${instructor.id}`} className="font-medium">Նկարի հղում</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id={`avatar-${instructor.id}`}
                        value={instructor.avatar_url || ''}
                        onChange={(e) => handleInstructorUpdate(instructor.id, 'avatar_url', e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="flex-grow"
                      />
                      <Button variant="outline" className="flex-shrink-0" type="button">
                        <Upload size={18} className="mr-2" /> Վերբեռնել
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorsTab;
