
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, Upload } from 'lucide-react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';

interface LogoSelectorProps {
  course: Partial<ProfessionalCourse>;
  setCourse: (course: Partial<ProfessionalCourse>) => void;
}

export const LogoSelector: React.FC<LogoSelectorProps> = ({ course, setCourse }) => {
  const [logoOption, setLogoOption] = React.useState(course.organizationLogo ? 'url' : 'upload');
  
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
  );
};
