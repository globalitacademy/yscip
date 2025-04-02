
import React from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AuthorTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: (changes: Partial<ProfessionalCourse>) => void;
}

export const AuthorTab: React.FC<AuthorTabProps> = ({ editedCourse, setEditedCourse }) => {
  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field} to:`, value);
    setEditedCourse({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="instructor">Դասավանդող</Label>
        <Input 
          id="instructor" 
          value={editedCourse.instructor || ''} 
          onChange={(e) => handleInputChange('instructor', e.target.value)}
          placeholder="Դասավանդողի անունը"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="createdBy">Ստեղծող</Label>
        <Input 
          id="createdBy" 
          value={editedCourse.createdBy || ''} 
          onChange={(e) => handleInputChange('createdBy', e.target.value)}
          placeholder="Ստեղծողի անունը"
          disabled={true}
        />
        <p className="text-xs text-muted-foreground">Ստեղծողը ավտոմատ լրացվում է և չի կարող փոխվել</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="buttonText">Կոճակի տեքստ</Label>
        <Input 
          id="buttonText" 
          value={editedCourse.buttonText || 'Դիտել'} 
          onChange={(e) => handleInputChange('buttonText', e.target.value)}
          placeholder="Դիտել"
        />
      </div>
    </div>
  );
};
