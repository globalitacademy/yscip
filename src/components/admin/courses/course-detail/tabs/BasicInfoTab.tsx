
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { IconSelector } from '@/components/courses/form-components/IconSelector';
import { MediaUploader } from '@/components/courses/form-components/MediaUploader';

interface BasicInfoTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
  isIconsOpen: boolean;
  setIsIconsOpen: (open: boolean) => void;
  handleIconSelect: (iconName: string) => void;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  editedCourse,
  setEditedCourse,
  isIconsOpen,
  setIsIconsOpen,
  handleIconSelect
}) => {
  const handleImageChange = (imageUrl: string) => {
    setEditedCourse({...editedCourse, imageUrl});
  };

  return (
    <div className="space-y-4">
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
          <MediaUploader 
            mediaUrl={editedCourse.imageUrl}
            onMediaChange={handleImageChange}
            label="Դասընթացի նկար"
            uploadLabel="Ներբեռնել նկար"
            placeholder="https://example.com/image.jpg"
            previewHeight="max-h-32"
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
          selectedIcon={editedCourse.iconName}
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
    </div>
  );
};
