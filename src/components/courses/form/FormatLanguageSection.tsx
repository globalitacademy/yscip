
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfessionalCourse } from '../types/ProfessionalCourse';

const formatOptions = [
  { label: 'Օնլայն', value: 'օնլայն' },
  { label: 'Առկա', value: 'առկա' },
  { label: 'Վիդեոկուրս', value: 'վիդեոկուրս' },
  { label: 'Խմբային', value: 'խմբային' },
  { label: 'Անհատական', value: 'անհատական' },
];

const languageOptions = [
  { label: 'Հայերեն', value: 'Հայերեն' },
  { label: 'Ռուսերեն', value: 'Ռուսերեն' },
  { label: 'Անգլերեն', value: 'Անգլերեն' },
];

interface FormatLanguageSectionProps {
  course: Partial<ProfessionalCourse>;
  setCourse: (course: Partial<ProfessionalCourse>) => void;
}

const FormatLanguageSection: React.FC<FormatLanguageSectionProps> = ({ course, setCourse }) => {
  const handleFormatChange = (value: string) => {
    setCourse({ ...course, format: value });
  };

  const handleLanguageToggle = (language: string) => {
    const languages = [...(course.languages || [])];
    const index = languages.indexOf(language);
    
    if (index > -1) {
      languages.splice(index, 1);
    } else {
      languages.push(language);
    }
    
    setCourse({ ...course, languages });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="format">Ձևաչափ</Label>
        <select
          id="format"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={course.format || ''}
          onChange={(e) => handleFormatChange(e.target.value)}
        >
          <option value="">Ընտրեք ձևաչափը</option>
          {formatOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label className="mb-2 block">Լեզուներ</Label>
        <div className="space-y-2">
          {languageOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`language-${option.value}`}
                checked={(course.languages || []).includes(option.value)}
                onCheckedChange={() => handleLanguageToggle(option.value)}
              />
              <Label 
                htmlFor={`language-${option.value}`}
                className="text-sm font-normal"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormatLanguageSection;
