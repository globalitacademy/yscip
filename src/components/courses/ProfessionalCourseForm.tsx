
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe, Layers, BookOpen } from 'lucide-react';

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
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="icon" className="text-right">
          Պատկեր
        </Label>
        <Select 
          value={getCurrentIconValue()} 
          onValueChange={handleIconChange}
        >
          <SelectTrigger className="col-span-3">
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

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="institution" className="text-right">
          Հաստատություն
        </Label>
        <Select 
          value={course.institution || ''} 
          onValueChange={(value) => setCourse({ ...course, institution: value })}
        >
          <SelectTrigger className="col-span-3">
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
      </div>
    </div>
  );
};

export default ProfessionalCourseForm;
