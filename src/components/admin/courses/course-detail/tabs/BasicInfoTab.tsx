
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { IconSelector } from '@/components/courses/form-components/IconSelector';
import { MediaUploader } from '@/components/courses/form-components/MediaUploader';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicInfoTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  editedCourse,
  setEditedCourse
}) => {
  const [isIconsOpen, setIsIconsOpen] = useState(false);
  
  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field} to:`, value);
    // Create a complete updated course object with the new field value
    const updatedCourse = { ...editedCourse, [field]: value };
    setEditedCourse(updatedCourse);
  };

  const handleImageChange = (imageUrl: string) => {
    // Create a complete updated course object with the new image URL
    const updatedCourse = { ...editedCourse, imageUrl };
    setEditedCourse(updatedCourse);
  };
  
  const handleIconSelect = (iconName: string) => {
    let newIcon;
    switch (iconName) {
      case 'code':
        newIcon = <Code className="w-16 h-16" />;
        break;
      case 'book':
        newIcon = <BookText className="w-16 h-16" />;
        break;
      case 'ai':
        newIcon = <BrainCircuit className="w-16 h-16" />;
        break;
      case 'database':
        newIcon = <Database className="w-16 h-16" />;
        break;
      case 'files':
        newIcon = <FileCode className="w-16 h-16" />;
        break;
      case 'web':
        newIcon = <Globe className="w-16 h-16" />;
        break;
      default:
        newIcon = <Code className="w-16 h-16" />;
    }
    setEditedCourse({ ...editedCourse, icon: newIcon, iconName: iconName });
    setIsIconsOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Վերնագիր</Label>
          <Input 
            id="title" 
            value={editedCourse.title || ''} 
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subtitle">Ենթավերնագիր</Label>
          <Input 
            id="subtitle" 
            value={editedCourse.subtitle || ''} 
            onChange={(e) => handleInputChange('subtitle', e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Տևողություն</Label>
          <Input 
            id="duration" 
            value={editedCourse.duration || ''} 
            onChange={(e) => handleInputChange('duration', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Գին</Label>
          <Input 
            id="price" 
            value={editedCourse.price || ''} 
            onChange={(e) => handleInputChange('price', e.target.value)}
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
            onChange={(e) => handleInputChange('institution', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="buttonText">Կոճակի տեքստ</Label>
          <Input 
            id="buttonText" 
            value={editedCourse.buttonText || ''} 
            onChange={(e) => handleInputChange('buttonText', e.target.value)}
            placeholder="Դիմել"
          />
          <p className="text-xs text-muted-foreground mt-1">Հեղինակային կոճակի տեքստ</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">URL հղում</Label>
          <Input 
            id="slug" 
            value={editedCourse.slug || ''} 
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="course-name"
          />
          <p className="text-xs text-muted-foreground mt-1">URL-ի հղումը դասընթացի համար (օր.՝ course-name)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Կատեգորիա</Label>
          <Select 
            value={editedCourse.category || ''} 
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Ընտրել կատեգորիան" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="programming">Ծրագրավորում</SelectItem>
              <SelectItem value="design">Դիզայն</SelectItem>
              <SelectItem value="business">Բիզնես</SelectItem>
              <SelectItem value="marketing">Մարքեթինգ</SelectItem>
              <SelectItem value="softSkills">Փափուկ հմտություններ</SelectItem>
              <SelectItem value="other">Այլ</SelectItem>
            </SelectContent>
          </Select>
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
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={5}
        />
      </div>
    </div>
  );
};
