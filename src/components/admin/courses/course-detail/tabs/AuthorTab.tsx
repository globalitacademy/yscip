
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Link, Upload } from 'lucide-react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';

interface AuthorTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
  logoOption: string;
  setLogoOption: (option: string) => void;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AuthorTab: React.FC<AuthorTabProps> = ({ 
  editedCourse, 
  setEditedCourse,
  logoOption,
  setLogoOption,
  handleLogoUpload
}) => {
  return (
    <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
      <div className="flex items-center gap-3 mb-4">
        <UserCircle className="h-6 w-6 text-amber-700" />
        <h3 className="font-semibold text-amber-800">Հեղինակի տվյալներ</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="createdBy">Հեղինակի անուն</Label>
          <Input 
            id="createdBy" 
            value={editedCourse.createdBy || ''} 
            onChange={(e) => setEditedCourse({...editedCourse, createdBy: e.target.value})}
            placeholder="Օր․՝ Անի Հովհաննիսյան"
            className="bg-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instructorTitle">Հեղինակի պաշտոն (ըստ ցանկության)</Label>
          <Input 
            id="instructorTitle" 
            value={editedCourse.instructor || ''} 
            onChange={(e) => setEditedCourse({...editedCourse, instructor: e.target.value})}
            placeholder="Օր․՝ Ավագ դասախոս"
            className="bg-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Կազմակերպության լոգո</Label>
          <Tabs value={logoOption} onValueChange={setLogoOption} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Ներբեռնել</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <div className="border rounded-md p-4 text-center bg-white">
                <label htmlFor="logoUpload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-8 w-8 mb-2 text-amber-700" />
                  <span>Ներբեռնել լոգո</span>
                  <input
                    id="logoUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
                {editedCourse.organizationLogo && (
                  <div className="mt-4">
                    <img 
                      src={editedCourse.organizationLogo} 
                      alt="Organization Logo Preview" 
                      className="max-h-20 mx-auto"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="url">
              <div className="border rounded-md p-4 bg-white">
                <div className="flex items-center">
                  <Link className="h-5 w-5 mr-2 text-amber-700" />
                  <Input
                    value={editedCourse.organizationLogo || ''}
                    onChange={(e) => setEditedCourse({...editedCourse, organizationLogo: e.target.value})}
                    placeholder="https://example.com/logo.jpg"
                    className="bg-white"
                  />
                </div>
                {editedCourse.organizationLogo && (
                  <div className="mt-4">
                    <img 
                      src={editedCourse.organizationLogo} 
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
    </div>
  );
};
