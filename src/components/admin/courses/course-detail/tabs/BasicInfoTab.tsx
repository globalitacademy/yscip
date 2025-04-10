
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { 
  CourseImageSelector, 
  CourseColorSelector, 
  IconSelector 
} from '@/components/courses/form-components';

interface BasicInfoTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  editedCourse,
  setEditedCourse
}) => {
  const handleInputChange = (field: string, value: string) => {
    setEditedCourse(prevState => ({ ...prevState, [field]: value }));
  };
  
  const handleIconChange = (iconName: string) => {
    setEditedCourse(prevState => ({ ...prevState, iconName }));
  };

  const handleImageChange = (imageUrl: string) => {
    setEditedCourse(prevState => ({ ...prevState, imageUrl }));
  };

  const handleColorChange = (color: string) => {
    setEditedCourse(prevState => ({ ...prevState, color }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Դասընթացի վերնագիր</Label>
          <Input 
            id="title" 
            value={editedCourse.title || ''} 
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Մեքենայական ուսուցում" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Ենթավերնագիր</Label>
          <Input 
            id="subtitle" 
            value={editedCourse.subtitle || ''} 
            onChange={(e) => handleInputChange('subtitle', e.target.value)}
            placeholder="ԴԱՍԸՆԹԱՑ" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Նկարագրություն</Label>
          <Textarea 
            id="description" 
            value={editedCourse.description || ''} 
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Դասընթացի մանրամասն նկարագրություն..."
            rows={5}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Տևողություն</Label>
            <Input 
              id="duration" 
              value={editedCourse.duration || ''} 
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder="3 շաբաթ" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Գին</Label>
            <Input 
              id="price" 
              value={editedCourse.price || ''} 
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="50,000 դրամ կամ Անվճար" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="buttonText">Կոճակի տեքստ</Label>
          <Input 
            id="buttonText" 
            value={editedCourse.buttonText || ''} 
            onChange={(e) => handleInputChange('buttonText', e.target.value)}
            placeholder="Գրանցվել" 
          />
        </div>
      </div>

      <div className="space-y-4">
        <IconSelector 
          selectedIcon={editedCourse.iconName || ''}
          onIconSelect={handleIconChange} 
        />
        
        <CourseColorSelector 
          selectedColor={editedCourse.color || ''}
          onColorSelect={handleColorChange}
        />
        
        <CourseImageSelector 
          imageUrl={editedCourse.imageUrl || ''}
          onImageSelect={handleImageChange}
          label="Դասընթացի նկար"
        />
      </div>
    </div>
  );
};
