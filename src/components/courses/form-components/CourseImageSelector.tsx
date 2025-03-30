
import React from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { MediaUploader } from './MediaUploader';
import { IconSelector } from './IconSelector';

interface CourseImageSelectorProps {
  course: Partial<ProfessionalCourse>;
  setCourse: (course: Partial<ProfessionalCourse>) => void;
}

export const CourseImageSelector: React.FC<CourseImageSelectorProps> = ({ course, setCourse }) => {
  const [isIconsOpen, setIsIconsOpen] = React.useState(false);
  
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
    setCourse({ ...course, icon: newIcon, iconName: iconName });
    setIsIconsOpen(false);
  };

  const handleMediaChange = (imageUrl: string) => {
    setCourse({ ...course, imageUrl });
  };

  return (
    <MediaUploader 
      mediaUrl={course.imageUrl}
      onMediaChange={handleMediaChange}
      label="Պատկեր"
      uploadLabel="Ներբեռնել նկար"
      placeholder="https://example.com/image.jpg"
      showIconOption={true}
      defaultTab={course.imageUrl ? 'url' : 'icon'}
      iconSelector={
        <IconSelector 
          isIconsOpen={isIconsOpen}
          setIsIconsOpen={setIsIconsOpen}
          onIconSelect={handleIconSelect}
          selectedIcon={course.iconName}
        />
      }
    />
  );
};

// Import icons directly in this file to avoid circular dependencies
import { Code, BookText, BrainCircuit, Database, FileCode, Globe } from 'lucide-react';
