
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe } from 'lucide-react';

interface ProfessionalCourseFormProps {
  course: ProfessionalCourse;
  setCourse: React.Dispatch<React.SetStateAction<ProfessionalCourse>>;
}

const colorOptions = [
  { value: 'text-amber-500', label: 'Amber' },
  { value: 'text-blue-500', label: 'Blue' },
  { value: 'text-red-500', label: 'Red' },
  { value: 'text-yellow-500', label: 'Yellow' },
  { value: 'text-purple-500', label: 'Purple' },
  { value: 'text-green-500', label: 'Green' },
];

const iconOptions = [
  { value: 'code', label: 'Code', icon: <Code className="w-5 h-5" /> },
  { value: 'book', label: 'Book', icon: <BookText className="w-5 h-5" /> },
  { value: 'brain', label: 'Brain', icon: <BrainCircuit className="w-5 h-5" /> },
  { value: 'database', label: 'Database', icon: <Database className="w-5 h-5" /> },
  { value: 'filecode', label: 'File Code', icon: <FileCode className="w-5 h-5" /> },
  { value: 'globe', label: 'Globe', icon: <Globe className="w-5 h-5" /> },
];

const institutionOptions = [
  { value: 'ՀՊՏՀ', label: 'ՀՊՏՀ' },
  { value: 'ԵՊՀ', label: 'ԵՊՀ' },
  { value: 'ՀԱՊՀ', label: 'ՀԱՊՀ' },
  { value: 'ՀԱՀ', label: 'ՀԱՀ' },
  { value: 'ՀՊՄՀ', label: 'ՀՊՄՀ' },
  { value: 'ՀՌԱՀ', label: 'ՀՌԱՀ' },
];

const ProfessionalCourseForm: React.FC<ProfessionalCourseFormProps> = ({
  course,
  setCourse
}) => {
  const getIconComponent = (iconName: string) => {
    const icon = iconOptions.find(i => i.value === iconName);
    return icon ? icon.icon : <Code className="w-16 h-16" />;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Վերնագիր</Label>
          <Input
            id="title"
            value={course.title}
            onChange={(e) => setCourse({ ...course, title: e.target.value })}
            placeholder="Դասընթացի վերնագիր"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Ենթավերնագիր</Label>
          <Input
            id="subtitle"
            value={course.subtitle}
            onChange={(e) => setCourse({ ...course, subtitle: e.target.value })}
            placeholder="Դասընթացի ենթավերնագիր"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Տևողություն</Label>
          <Input
            id="duration"
            value={course.duration}
            onChange={(e) => setCourse({ ...course, duration: e.target.value })}
            placeholder="Օր. 6 ամիս"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Արժեք</Label>
          <Input
            id="price"
            value={course.price}
            onChange={(e) => setCourse({ ...course, price: e.target.value })}
            placeholder="Օր. 58,000 ֏"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="icon">Պատկեր</Label>
          <Select
            value={iconOptions.find(i => i.icon.type === course.icon?.type)?.value || 'code'}
            onValueChange={(value) => setCourse({ ...course, icon: getIconComponent(value) })}
          >
            <SelectTrigger id="icon">
              <SelectValue placeholder="Ընտրեք պատկեր" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((icon) => (
                <SelectItem key={icon.value} value={icon.value}>
                  <div className="flex items-center">
                    {icon.icon}
                    <span className="ml-2">{icon.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Գույն</Label>
          <Select
            value={course.color}
            onValueChange={(value) => setCourse({ ...course, color: value })}
          >
            <SelectTrigger id="color">
              <SelectValue placeholder="Ընտրեք գույն" />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${color.value.replace('text-', 'bg-')}`} />
                    <span className="ml-2">{color.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="createdBy">Դասախոս</Label>
          <Input
            id="createdBy"
            value={course.createdBy}
            onChange={(e) => setCourse({ ...course, createdBy: e.target.value })}
            placeholder="Դասախոսի անուն"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="institution">Հաստատություն</Label>
          <Select
            value={course.institution}
            onValueChange={(value) => setCourse({ ...course, institution: value })}
          >
            <SelectTrigger id="institution">
              <SelectValue placeholder="Ընտրեք հաստատություն" />
            </SelectTrigger>
            <SelectContent>
              {institutionOptions.map((inst) => (
                <SelectItem key={inst.value} value={inst.value}>
                  {inst.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="buttonText">Կոճակի տեքստ</Label>
        <Input
          id="buttonText"
          value={course.buttonText}
          onChange={(e) => setCourse({ ...course, buttonText: e.target.value })}
          placeholder="Օր. Դիտել"
        />
      </div>
    </div>
  );
};

export default ProfessionalCourseForm;
