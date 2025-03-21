
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link } from 'lucide-react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';

interface InstitutionSectionProps {
  course: Partial<ProfessionalCourse>;
  setCourse: (course: Partial<ProfessionalCourse>) => void;
}

const InstitutionSection: React.FC<InstitutionSectionProps> = ({ course, setCourse }) => {
  const [useCustomInstitution, setUseCustomInstitution] = useState(
    !['ՀՊՏՀ', 'ԵՊՀ', 'ՀԱՊՀ', 'ՀԱՀ', 'ՀՊՄՀ', 'ՀՌԱՀ'].includes(course.institution || '')
  );
  const [logoOption, setLogoOption] = useState(course.organizationLogo ? 'url' : 'upload');

  const handleInstitutionChange = (value: string) => {
    setCourse({ ...course, institution: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCourse({ ...course, organizationLogo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
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

      <div>
        <Label>Կազմակերպության լոգո</Label>
        <Tabs value={logoOption} onValueChange={setLogoOption} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Ներբեռնել</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <div className="border rounded-md p-4 text-center">
              <label htmlFor="logoUpload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-8 w-8 mb-2" />
                <span>Ներբեռնել լոգո</span>
                <input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </label>
              {course.organizationLogo && (
                <div className="mt-4">
                  <img 
                    src={course.organizationLogo} 
                    alt="Organization Logo Preview" 
                    className="max-h-20 mx-auto"
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
                  value={course.organizationLogo || ''}
                  onChange={(e) => setCourse({ ...course, organizationLogo: e.target.value })}
                  placeholder="https://example.com/logo.jpg"
                />
              </div>
              {course.organizationLogo && (
                <div className="mt-4">
                  <img 
                    src={course.organizationLogo} 
                    alt="Organization Logo Preview" 
                    className="max-h-20 mx-auto"
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InstitutionSection;
