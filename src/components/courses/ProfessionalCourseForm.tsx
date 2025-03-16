
import React from 'react';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe } from 'lucide-react';

interface ProfessionalCourseFormProps {
  course: Partial<ProfessionalCourse>;
  setCourse: (course: Partial<ProfessionalCourse>) => void;
  isEdit?: boolean;
}

const ProfessionalCourseForm: React.FC<ProfessionalCourseFormProps> = ({ course, setCourse, isEdit = false }) => {
  // Available colors with display names
  const colors = [
    { value: 'text-amber-500', label: 'Դեղին' },
    { value: 'text-blue-500', label: 'Կապույտ' },
    { value: 'text-red-500', label: 'Կարմիր' },
    { value: 'text-green-500', label: 'Կանաչ' },
    { value: 'text-purple-500', label: 'Մանուշակագույն' },
    { value: 'text-pink-500', label: 'Վարդագույն' }
  ];

  // Available icons with display names
  const icons = [
    { value: 'Code', component: <Code className="w-5 h-5" />, label: 'Կոդ' },
    { value: 'BookText', component: <BookText className="w-5 h-5" />, label: 'Գիրք' },
    { value: 'BrainCircuit', component: <BrainCircuit className="w-5 h-5" />, label: 'Արհեստական Բանականություն' },
    { value: 'Database', component: <Database className="w-5 h-5" />, label: 'Տվյալների բազա' },
    { value: 'FileCode', component: <FileCode className="w-5 h-5" />, label: 'Ֆայլի կոդ' },
    { value: 'Globe', component: <Globe className="w-5 h-5" />, label: 'Գլոբուս' }
  ];

  // Helper to get icon component from type
  const getIconFromType = (iconType: any) => {
    if (!iconType) return 'Code';
    
    // Handle both cases: when we get a component or just the type name
    const typeName = iconType.type?.name || iconType.type || iconType;
    return typeName;
  };

  // Handle icon selection
  const handleIconSelect = (iconName: string) => {
    let iconComponent;
    
    switch (iconName) {
      case 'Code':
        iconComponent = React.createElement(Code, { className: "w-16 h-16" });
        break;
      case 'BookText':
        iconComponent = React.createElement(BookText, { className: "w-16 h-16" });
        break;
      case 'BrainCircuit':
        iconComponent = React.createElement(BrainCircuit, { className: "w-16 h-16" });
        break;
      case 'Database':
        iconComponent = React.createElement(Database, { className: "w-16 h-16" });
        break;
      case 'FileCode':
        iconComponent = React.createElement(FileCode, { className: "w-16 h-16" });
        break;
      case 'Globe':
        iconComponent = React.createElement(Globe, { className: "w-16 h-16" });
        break;
      default:
        iconComponent = React.createElement(Code, { className: "w-16 h-16" });
    }
    
    setCourse({ ...course, icon: iconComponent });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Վերնագիր *</Label>
        <Input
          id="title"
          value={course.title || ''}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          placeholder="Օր․՝ WEB Front-End"
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="subtitle">Ենթավերնագիր</Label>
        <Input
          id="subtitle"
          value={course.subtitle || 'ԴԱՍԸՆԹԱՑ'}
          onChange={(e) => setCourse({ ...course, subtitle: e.target.value })}
          placeholder="Օր․՝ ԴԱՍԸՆԹԱՑ"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="duration">Տևողություն *</Label>
        <Input
          id="duration"
          value={course.duration || ''}
          onChange={(e) => setCourse({ ...course, duration: e.target.value })}
          placeholder="Օր․՝ 6 ամիս"
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="price">Արժեք *</Label>
        <Input
          id="price"
          value={course.price || ''}
          onChange={(e) => setCourse({ ...course, price: e.target.value })}
          placeholder="Օր․՝ 58,000 ֏"
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="institution">Հաստատություն</Label>
        <Input
          id="institution"
          value={course.institution || ''}
          onChange={(e) => setCourse({ ...course, institution: e.target.value })}
          placeholder="Օր․՝ ՀՊՏՀ"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="buttonText">Կոճակի տեքստ</Label>
        <Input
          id="buttonText"
          value={course.buttonText || 'Դիտել'}
          onChange={(e) => setCourse({ ...course, buttonText: e.target.value })}
          placeholder="Օր․՝ Դիտել"
        />
      </div>
      
      <div className="grid gap-2">
        <Label>Պատկերակ</Label>
        <Select 
          value={getIconFromType(course.icon)} 
          onValueChange={handleIconSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder="Ընտրեք պատկերակ" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {icons.map(icon => (
                <SelectItem key={icon.value} value={icon.value}>
                  <div className="flex items-center gap-2">
                    {icon.component}
                    <span>{icon.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label>Գույն</Label>
        <Select 
          value={course.color || 'text-amber-500'} 
          onValueChange={(value) => setCourse({ ...course, color: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Ընտրեք գույն" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {colors.map(color => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${color.value.replace('text', 'bg')}`}></div>
                    <span>{color.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">Նկարագրություն</Label>
        <Textarea
          id="description"
          value={course.description || ''}
          onChange={(e) => setCourse({ ...course, description: e.target.value })}
          placeholder="Դասընթացի մանրամասն նկարագրություն..."
          rows={5}
        />
      </div>
    </div>
  );
};

export default ProfessionalCourseForm;
