
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, Image } from 'lucide-react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { IconSelector } from '@/components/courses/form-components/IconSelector';

interface BasicInfoTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
  isIconsOpen: boolean;
  setIsIconsOpen: (open: boolean) => void;
  imageOption: string;
  setImageOption: (option: string) => void;
  handleIconSelect: (iconName: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  editedCourse,
  setEditedCourse,
  isIconsOpen,
  setIsIconsOpen,
  imageOption,
  setImageOption,
  handleIconSelect,
  handleImageUpload
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Վերնագիր</Label>
          <Input 
            id="title" 
            value={editedCourse.title || ''} 
            onChange={(e) => setEditedCourse({...editedCourse, title: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subtitle">Ենթավերնագիր</Label>
          <Input 
            id="subtitle" 
            value={editedCourse.subtitle || ''} 
            onChange={(e) => setEditedCourse({...editedCourse, subtitle: e.target.value})}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Տևողություն</Label>
          <Input 
            id="duration" 
            value={editedCourse.duration || ''} 
            onChange={(e) => setEditedCourse({...editedCourse, duration: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Գին</Label>
          <Input 
            id="price" 
            value={editedCourse.price || ''} 
            onChange={(e) => setEditedCourse({...editedCourse, price: e.target.value})}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Դասընթացի նկար</Label>
          <Tabs value={imageOption} onValueChange={setImageOption} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Ներբեռնել</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <div className="border rounded-md p-4 text-center bg-white">
                <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
                  <Image className="h-8 w-8 mb-2 text-amber-700" />
                  <span>Ներբեռնել նկար</span>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                {editedCourse.imageUrl && (
                  <div className="mt-4">
                    <img 
                      src={editedCourse.imageUrl} 
                      alt="Course Image Preview" 
                      className="max-h-32 mx-auto"
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
                    value={editedCourse.imageUrl || ''}
                    onChange={(e) => setEditedCourse({...editedCourse, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    className="bg-white"
                  />
                </div>
                {editedCourse.imageUrl && (
                  <div className="mt-4">
                    <img 
                      src={editedCourse.imageUrl} 
                      alt="Course Image Preview" 
                      className="max-h-32 mx-auto"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="institution">Հաստատություն</Label>
          <Input 
            id="institution" 
            value={editedCourse.institution || ''} 
            onChange={(e) => setEditedCourse({...editedCourse, institution: e.target.value})}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Պատկերակ</Label>
        <IconSelector 
          isIconsOpen={isIconsOpen}
          setIsIconsOpen={setIsIconsOpen}
          onIconSelect={handleIconSelect}
          selectedIcon={editedCourse.iconName}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Նկարագրություն</Label>
        <Textarea 
          id="description" 
          value={editedCourse.description || ''} 
          onChange={(e) => setEditedCourse({...editedCourse, description: e.target.value})}
          rows={5}
        />
      </div>
    </div>
  );
};
