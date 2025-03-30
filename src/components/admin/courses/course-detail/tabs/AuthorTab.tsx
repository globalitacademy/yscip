
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserCircle } from 'lucide-react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { MediaUploader } from '@/components/courses/form-components/MediaUploader';

interface AuthorTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
}

export const AuthorTab: React.FC<AuthorTabProps> = ({ 
  editedCourse, 
  setEditedCourse
}) => {
  const handleLogoChange = (organizationLogo: string) => {
    setEditedCourse({...editedCourse, organizationLogo});
  };

  return (
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
          <MediaUploader 
            mediaUrl={editedCourse.organizationLogo}
            onMediaChange={handleLogoChange}
            label="Կազմակերպության լոգո"
            uploadLabel="Ներբեռնել լոգո"
            placeholder="https://example.com/logo.jpg"
            previewHeight="max-h-20"
          />
        </div>
      </div>
    </div>
  );
};
