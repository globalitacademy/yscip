
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const handleInputChange = (field: string, value: string) => {
    setEditedCourse({ ...editedCourse, [field]: value });
  };
  
  const handleAuthorTypeChange = (value: string) => {
    setEditedCourse({ 
      ...editedCourse, 
      author_type: value as 'lecturer' | 'institution' 
    });
  };

  const handleLogoChange = (url: string) => {
    setEditedCourse({ ...editedCourse, organizationLogo: url });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Հեղինակի տվյալներ</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="author_type">Հեղինակի տեսակ</Label>
          <Select 
            value={editedCourse.author_type || 'lecturer'} 
            onValueChange={handleAuthorTypeChange}
          >
            <SelectTrigger id="author_type">
              <SelectValue placeholder="Ընտրեք հեղինակի տեսակը" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lecturer">Դասախոս</SelectItem>
              <SelectItem value="institution">Հաստատություն</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {editedCourse.author_type === 'lecturer' ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="createdBy">Դասախոսի անուն</Label>
              <Input 
                id="createdBy" 
                value={editedCourse.createdBy || ''} 
                onChange={(e) => handleInputChange('createdBy', e.target.value)}
                placeholder="Անուն Ազգանուն"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instructor">Դասախոսի պաշտոն</Label>
              <Input 
                id="instructor" 
                value={editedCourse.instructor || ''} 
                onChange={(e) => handleInputChange('instructor', e.target.value)}
                placeholder="Մասնագիտական պաշտոն"
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="institution">Հաստատության անուն</Label>
              <Input 
                id="institution" 
                value={editedCourse.institution || ''} 
                onChange={(e) => handleInputChange('institution', e.target.value)}
                placeholder="ՀՊՏՀ"
              />
            </div>
            
            <div className="space-y-2">
              <MediaUploader 
                mediaUrl={editedCourse.organizationLogo}
                onMediaChange={handleLogoChange}
                label="Կազմակերպության լոգո"
                uploadLabel="Ներբեռնել լոգոն"
                placeholder="https://example.com/logo.png"
                previewHeight="max-h-16"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
