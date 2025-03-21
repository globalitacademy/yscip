
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from "@/components/ui/button";
import { ChevronDown, Upload, Link, Code, BookText, BrainCircuit, Database, FileCode, Globe } from 'lucide-react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';

const colorOptions = [
  { label: 'Ամբերային', value: 'text-amber-500' },
  { label: 'Կապույտ', value: 'text-blue-500' },
  { label: 'Կարմիր', value: 'text-red-500' },
  { label: 'Դեղին', value: 'text-yellow-500' },
  { label: 'Մանուշակագույն', value: 'text-purple-500' },
  { label: 'Կանաչ', value: 'text-green-500' },
];

const iconOptions = [
  { label: 'Կոդ', value: 'code', icon: <Code className="h-5 w-5" /> },
  { label: 'Գիրք', value: 'book', icon: <BookText className="h-5 w-5" /> },
  { label: 'ԻԻ', value: 'ai', icon: <BrainCircuit className="h-5 w-5" /> },
  { label: 'Տվյալներ', value: 'database', icon: <Database className="h-5 w-5" /> },
  { label: 'Ֆայլեր', value: 'files', icon: <FileCode className="h-5 w-5" /> },
  { label: 'Վեբ', value: 'web', icon: <Globe className="h-5 w-5" /> },
];

interface MediaSectionProps {
  course: Partial<ProfessionalCourse>;
  setCourse: (course: Partial<ProfessionalCourse>) => void;
  isEdit?: boolean;
}

const MediaSection: React.FC<MediaSectionProps> = ({ course, setCourse, isEdit = false }) => {
  const [isIconsOpen, setIsIconsOpen] = useState(false);
  const [isColorsOpen, setIsColorsOpen] = useState(false);
  const [imageOption, setImageOption] = useState(course.imageUrl ? 'url' : 'icon');
  const [selectedIconName, setSelectedIconName] = useState<string | undefined>(
    course.iconName || undefined
  );

  React.useEffect(() => {
    if (isEdit && course.icon && course.iconName) {
      setSelectedIconName(course.iconName);
    }
  }, [isEdit, course.icon, course.iconName]);

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
    setSelectedIconName(iconName);
    setIsIconsOpen(false);
  };

  const handleColorSelect = (color: string) => {
    setCourse({ ...course, color });
    setIsColorsOpen(false);
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

  const renderSelectedIconIndicator = () => {
    if (!selectedIconName) return null;

    const option = iconOptions.find(opt => opt.value === selectedIconName);
    
    if (option) {
      return (
        <div className="mt-2 p-2 bg-gray-100 rounded-md flex items-center">
          <span className="mr-2">Ընտրված է:</span>
          {option.icon}
          <span className="ml-2">{option.label}</span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Ցուցադրել որպես</Label>
          <div className="flex items-center space-x-2">
            <Label htmlFor="prefer-icon" className="text-sm mr-2">
              {course.preferIcon ? "Պատկերակ" : "Նկար"}
            </Label>
            <Switch 
              id="prefer-icon" 
              checked={course.preferIcon}
              onCheckedChange={(checked) => setCourse({ ...course, preferIcon: checked })}
            />
          </div>
        </div>
        
        <Tabs value={imageOption} onValueChange={setImageOption} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="icon">Պատկերակ</TabsTrigger>
            <TabsTrigger value="upload">Ներբեռնել</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>
          <TabsContent value="icon">
            <Collapsible
              open={isIconsOpen}
              onOpenChange={setIsIconsOpen}
              className="w-full border rounded-md p-2"
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between cursor-pointer p-2">
                  <span>Ընտրել պատկերակ</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isIconsOpen ? 'transform rotate-180' : ''}`} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className="grid grid-cols-3 gap-2">
                  {iconOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={selectedIconName === option.value ? "default" : "outline"}
                      className={`flex flex-col items-center p-2 h-auto ${selectedIconName === option.value ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => handleIconSelect(option.value)}
                    >
                      {option.icon}
                      <span className="mt-1 text-xs">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
            {renderSelectedIconIndicator()}
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

      <Collapsible
        open={isColorsOpen}
        onOpenChange={setIsColorsOpen}
        className="w-full border rounded-md p-2"
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer p-2">
            <span>Գույնի ընտրություն</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isColorsOpen ? 'transform rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="grid grid-cols-3 gap-2">
            {colorOptions.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className={`p-2 ${option.value.replace('text-', 'bg-').replace('-500', '-100')}`}
                onClick={() => handleColorSelect(option.value)}
              >
                <span className={option.value}>{option.label}</span>
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default MediaSection;
