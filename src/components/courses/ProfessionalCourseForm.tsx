
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe, Layers, BookOpen, Upload, Image, Link, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Icon options for the dropdown
const iconOptions = [
  { label: 'Կոդ', value: 'code', icon: Code },
  { label: 'Գիրք', value: 'book', icon: BookText },
  { label: 'Ուղեղ', value: 'brain', icon: BrainCircuit },
  { label: 'Տվյալների բազա', value: 'database', icon: Database },
  { label: 'Կոդի ֆայլ', value: 'fileCode', icon: FileCode },
  { label: 'Գլոբուս', value: 'globe', icon: Globe },
  { label: 'Շերտեր', value: 'layers', icon: Layers },
  { label: 'Բաց գիրք', value: 'bookOpen', icon: BookOpen },
];

// Color options for the dropdown
const colorOptions = [
  { label: 'Կապույտ', value: 'blue' },
  { label: 'Կարմիր', value: 'red' },
  { label: 'Կանաչ', value: 'green' },
  { label: 'Դեղին', value: 'amber' },
  { label: 'Մանուշակագույն', value: 'purple' },
  { label: 'Վարդագույն', value: 'pink' },
  { label: 'Նարնջագույն', value: 'orange' },
];

// Institution options for the dropdown
const institutionOptions = [
  { label: 'ՀՊՏՀ', value: 'ՀՊՏՀ' },
  { label: 'ԵՊՀ', value: 'ԵՊՀ' },
  { label: 'ՊՀ', value: 'ՊՀ' },
  { label: 'ԵԹԿՊԻ', value: 'ԵԹԿՊԻ' },
  { label: 'ՀՊՄՀ', value: 'ՀՊՄՀ' },
  { label: 'Ազգային պոլիտեխնիկական համալսարան', value: 'Ազգային պոլիտեխնիկական համալսարան' },
  { label: 'ԱյԹի ակադեմիա', value: 'ԱյԹի ակադեմիա' },
  { label: 'Այլ', value: 'Այլ' },
];

interface ProfessionalCourseFormProps {
  course: Partial<ProfessionalCourse>;
  setCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
  isEdit?: boolean;
}

const ProfessionalCourseForm: React.FC<ProfessionalCourseFormProps> = ({
  course,
  setCourse,
  isEdit = false
}) => {
  // State for the custom institution input
  const [customInstitution, setCustomInstitution] = useState<string>('');
  const [showCustomInstitution, setShowCustomInstitution] = useState<boolean>(course.institution === 'Այլ');
  
  // State for image selection
  const [imageType, setImageType] = useState<'icon' | 'upload' | 'url'>('icon');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(course.imageUrl || '');
  
  // Helper function to get icon component by value
  const getIconByValue = (value: string) => {
    const iconOption = iconOptions.find(opt => opt.value === value);
    return iconOption ? iconOption.icon : Code;
  };

  // Helper function to get current icon value
  const getCurrentIconValue = () => {
    for (const option of iconOptions) {
      if (course.icon && course.icon.type === option.icon) {
        return option.value;
      }
    }
    return 'code'; // Default to code
  };

  // Handle icon change
  const handleIconChange = (value: string) => {
    const IconComponent = getIconByValue(value);
    setCourse({
      ...course,
      icon: React.createElement(IconComponent, { className: "w-16 h-16" })
    });
  };
  
  // Handle institution change
  const handleInstitutionChange = (value: string) => {
    setCourse({ ...course, institution: value });
    setShowCustomInstitution(value === 'Այլ');
  };
  
  // Handle custom institution change
  const handleCustomInstitutionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInstitution(e.target.value);
    setCourse({ ...course, institution: e.target.value });
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a temporary URL for the file
      const fileUrl = URL.createObjectURL(file);
      setImageUrl(fileUrl);
      setCourse({ ...course, imageUrl: fileUrl });
    }
  };
  
  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setCourse({ ...course, imageUrl: e.target.value });
  };
  
  // Reset image selection
  const resetImage = () => {
    setImageFile(null);
    setImageUrl('');
    setCourse({ ...course, imageUrl: undefined });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Անվանում
        </Label>
        <Input
          id="title"
          value={course.title || ''}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="duration" className="text-right">
          Տևողություն
        </Label>
        <Input
          id="duration"
          value={course.duration || ''}
          onChange={(e) => setCourse({ ...course, duration: e.target.value })}
          className="col-span-3"
          placeholder="Օր․ 6 ամիս"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">
          Արժեք
        </Label>
        <Input
          id="price"
          value={course.price || ''}
          onChange={(e) => setCourse({ ...course, price: e.target.value })}
          className="col-span-3"
          placeholder="Օր․ 58,000 ֏"
        />
      </div>
      
      {/* Image or Icon Selection */}
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right pt-2">
          Պատկեր
        </Label>
        <div className="col-span-3">
          <Tabs defaultValue={imageType} onValueChange={(value) => setImageType(value as 'icon' | 'upload' | 'url')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="icon">Պատրաստի Պատկեր</TabsTrigger>
              <TabsTrigger value="upload">Ներբեռնել</TabsTrigger>
              <TabsTrigger value="url">Հղում</TabsTrigger>
            </TabsList>
            <TabsContent value="icon" className="space-y-4 pt-4">
              <Select 
                value={getCurrentIconValue()} 
                onValueChange={handleIconChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ընտրեք պատկերը" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      <div className="flex items-center">
                        {React.createElement(icon.icon, { className: "w-4 h-4 mr-2" })}
                        {icon.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TabsContent>
            <TabsContent value="upload" className="space-y-4 pt-4">
              <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center">
                {imageFile ? (
                  <div className="space-y-2 flex flex-col items-center">
                    <img 
                      src={imageUrl} 
                      alt="Uploaded"
                      className="h-20 w-20 object-contain"
                    />
                    <Button variant="outline" size="sm" onClick={resetImage}>
                      <X className="w-4 h-4 mr-2" />
                      Հեռացնել
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Նկար ներբեռնելու համար սեղմեք այստեղ</p>
                    <Input
                      id="course-image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('course-image')?.click()}
                    >
                      Ընտրել նկար
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>
            <TabsContent value="url" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={imageUrl}
                    onChange={handleUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1"
                  />
                  {imageUrl && (
                    <Button variant="outline" size="icon" onClick={resetImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {imageUrl && (
                  <div className="mt-2 flex justify-center">
                    <img 
                      src={imageUrl} 
                      alt="From URL"
                      className="h-20 w-20 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="color" className="text-right">
          Գույն
        </Label>
        <Select 
          value={course.color || 'blue'} 
          onValueChange={(value) => setCourse({ ...course, color: value })}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Ընտրեք գույնը" />
          </SelectTrigger>
          <SelectContent>
            {colorOptions.map((color) => (
              <SelectItem key={color.value} value={color.value}>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded mr-2 bg-${color.value}-500`}></div>
                  {color.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="createdBy" className="text-right">
          Ստեղծող
        </Label>
        <Input
          id="createdBy"
          value={course.createdBy || ''}
          onChange={(e) => setCourse({ ...course, createdBy: e.target.value })}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="institution" className="text-right pt-2">
          Հաստատություն
        </Label>
        <div className="col-span-3 space-y-2">
          <Select 
            value={course.institution || ''} 
            onValueChange={handleInstitutionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ընտրեք հաստատությունը" />
            </SelectTrigger>
            <SelectContent>
              {institutionOptions.map((institution) => (
                <SelectItem key={institution.value} value={institution.value}>
                  {institution.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showCustomInstitution && (
            <Input
              value={customInstitution}
              onChange={handleCustomInstitutionChange}
              placeholder="Մուտքագրեք հաստատության անվանումը"
              className="mt-2"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCourseForm;
