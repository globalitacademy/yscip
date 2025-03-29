
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfessionalCourse } from '../types/ProfessionalCourse';

interface CourseInstitutionSelectorProps {
  course: Partial<ProfessionalCourse>;
  setCourse: (course: Partial<ProfessionalCourse>) => void;
}

export const CourseInstitutionSelector: React.FC<CourseInstitutionSelectorProps> = ({ course, setCourse }) => {
  const [useCustomInstitution, setUseCustomInstitution] = React.useState(
    !['ՀՊՏՀ', 'ԵՊՀ', 'ՀԱՊՀ', 'ՀԱՀ', 'ՀՊՄՀ', 'ՀՌԱՀ'].includes(course.institution || '')
  );

  const handleInstitutionChange = (value: string) => {
    setCourse({ ...course, institution: value });
  };

  return (
    <div>
      <Label>Հաստատություն</Label>
      <div className="flex items-center mb-2">
        <input 
          type="checkbox" 
          id="customInstitution" 
          className="mr-2"
          checked={useCustomInstitution}
          onChange={(e) => setUseCustomInstitution(e.target.checked)}
        />
        <Label htmlFor="customInstitution" className="text-sm font-normal">
          Մուտքագրել այլ հաստատություն
        </Label>
      </div>

      {useCustomInstitution ? (
        <Input
          value={course.institution || ''}
          onChange={(e) => handleInstitutionChange(e.target.value)}
          placeholder="Հաստատության անվանումը"
        />
      ) : (
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={course.institution || ''}
          onChange={(e) => handleInstitutionChange(e.target.value)}
        >
          <option value="ՀՊՏՀ">ՀՊՏՀ</option>
          <option value="ԵՊՀ">ԵՊՀ</option>
          <option value="ՀԱՊՀ">ՀԱՊՀ</option>
          <option value="ՀԱՀ">ՀԱՀ</option>
          <option value="ՀՊՄՀ">ՀՊՄՀ</option>
          <option value="ՀՌԱՀ">ՀՌԱՀ</option>
        </select>
      )}
    </div>
  );
};
