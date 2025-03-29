
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, Upload } from 'lucide-react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { IconSelector } from './IconSelector';

interface CourseImageSelectorProps {
  course: Partial<ProfessionalCourse>;
  setCourse: (course: Partial<ProfessionalCourse>) => void;
}

export const CourseImageSelector: React.FC<CourseImageSelectorProps> = ({ course, setCourse }) => {
  const [imageOption, setImageOption] = React.useState(course.imageUrl ? 'url' : 'icon');
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCourse({ ...course, imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Label>Պատկեր</Label>
      <Tabs value={imageOption} onValueChange={setImageOption} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="icon">Պատկերակ</TabsTrigger>
          <TabsTrigger value="upload">Ներբեռնել</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="icon">
          <IconSelector 
            isIconsOpen={isIconsOpen}
            setIsIconsOpen={setIsIconsOpen}
            onIconSelect={handleIconSelect}
          />
        </TabsContent>
        
        <TabsContent value="upload">
          <div className="border rounded-md p-4 text-center">
            <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
              <Upload className="h-8 w-8 mb-2" />
              <span>Ներբեռնել նկար</span>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            {course.imageUrl && (
              <div className="mt-4">
                <img 
                  src={course.imageUrl} 
                  alt="Course Image Preview" 
                  className="max-h-40 mx-auto"
                />
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="url">
          <div className="border rounded-md p-4">
            <div className="flex items-center">
              <Link className="h-5 w-5 mr-2" />
              <Input
                value={course.imageUrl || ''}
                onChange={(e) => setCourse({ ...course, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {course.imageUrl && (
              <div className="mt-4">
                <img 
                  src={course.imageUrl} 
                  alt="Course Image Preview" 
                  className="max-h-40 mx-auto"
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Import icons directly in this file to avoid circular dependencies
import { Code, BookText, BrainCircuit, Database, FileCode, Globe } from 'lucide-react';
