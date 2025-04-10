
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';

interface DisplaySettingsTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
}

export const DisplaySettingsTab: React.FC<DisplaySettingsTabProps> = ({
  editedCourse,
  setEditedCourse
}) => {
  const handleSwitchChange = (field: string, value: boolean) => {
    setEditedCourse({ ...editedCourse, [field]: value });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setEditedCourse({ ...editedCourse, [field]: value });
  };
  
  const handleCategoryChange = (value: string) => {
    setEditedCourse({ ...editedCourse, category: value });
  };
  
  const handleLearningFormatToggle = (format: string) => {
    const currentFormats = editedCourse.learning_formats || [];
    const updatedFormats = currentFormats.includes(format)
      ? currentFormats.filter(f => f !== format)
      : [...currentFormats, format];
      
    setEditedCourse({ ...editedCourse, learning_formats: updatedFormats });
  };
  
  const handleLanguageToggle = (language: string) => {
    const currentLanguages = editedCourse.languages || [];
    const updatedLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter(l => l !== language)
      : [...currentLanguages, language];
      
    setEditedCourse({ ...editedCourse, languages: updatedLanguages });
  };
  
  const addResource = () => {
    const resources = editedCourse.resources || [];
    setEditedCourse({ 
      ...editedCourse, 
      resources: [...resources, { title: '', url: '', type: 'link' }] 
    });
  };
  
  const updateResource = (index: number, field: keyof typeof resources[0], value: string) => {
    const resources = [...(editedCourse.resources || [])];
    resources[index] = { ...resources[index], [field]: value };
    setEditedCourse({ ...editedCourse, resources });
  };
  
  const removeResource = (index: number) => {
    const resources = [...(editedCourse.resources || [])];
    resources.splice(index, 1);
    setEditedCourse({ ...editedCourse, resources });
  };
  
  const handleSyllabusUrlChange = (url: string) => {
    setEditedCourse({ ...editedCourse, syllabus_file: url });
  };

  // Helper function to check if a format is selected
  const isFormatSelected = (format: string) => {
    return (editedCourse.learning_formats || []).includes(format);
  };
  
  // Helper function to check if a language is selected
  const isLanguageSelected = (language: string) => {
    return (editedCourse.languages || []).includes(language);
  };
  
  // Get resources array safely
  const resources = editedCourse.resources || [];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Ցուցադրման կարգավորումներ</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="is_public" className="font-medium">Հրապարակային դասընթաց</Label>
            <p className="text-sm text-muted-foreground">Դասընթացը տեսանելի կլինի բոլոր օգտատերերին</p>
          </div>
          <Switch 
            id="is_public" 
            checked={editedCourse.is_public || false}
            onCheckedChange={(checked) => handleSwitchChange('is_public', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="show_on_homepage" className="font-medium">Ցուցադրել գլխավոր էջում</Label>
            <p className="text-sm text-muted-foreground">Դասընթացը կցուցադրվի գլխավոր էջի դասընթացների բաժնում</p>
          </div>
          <Switch 
            id="show_on_homepage" 
            checked={editedCourse.show_on_homepage || false}
            onCheckedChange={(checked) => handleSwitchChange('show_on_homepage', checked)}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="display_order">Ցուցադրման հերթականություն</Label>
          <Input
            id="display_order"
            type="number"
            min="0"
            value={editedCourse.display_order || 0}
            onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
            className="w-32"
          />
          <p className="text-xs text-muted-foreground mt-1">Ավելի փոքր թվով դասընթացները ցուցադրվում են առաջինը</p>
        </div>
        
        <div>
          <Label htmlFor="category">Դասընթացի կատեգորիա</Label>
          <Select 
            value={editedCourse.category || ''} 
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ընտրեք կատեգորիա" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="programming">Ծրագրավորում</SelectItem>
              <SelectItem value="design">Դիզայն</SelectItem>
              <SelectItem value="business">Բիզնես</SelectItem>
              <SelectItem value="marketing">Մարքեթինգ</SelectItem>
              <SelectItem value="languages">Լեզուներ</SelectItem>
              <SelectItem value="other">Այլ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="color">Դասընթացի գույն</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="color"
              type="text"
              value={editedCourse.color || 'text-amber-500'}
              onChange={(e) => handleInputChange('color', e.target.value)}
              placeholder="text-amber-500"
            />
            <div className="flex gap-2">
              {['text-blue-500', 'text-green-500', 'text-amber-500', 'text-red-500', 'text-purple-500', 'text-indigo-500'].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 rounded-full ${color.replace('text', 'bg')}`}
                  onClick={() => handleInputChange('color', color)}
                  aria-label={`Ընտրել ${color} գույնը`}
                ></button>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Tailwind գույնի անվանում (օր.՝ text-amber-500)</p>
        </div>
      </div>
      
      {/* Learning formats section */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Ուսուցման ձևաչափ</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="format-online" 
              checked={isFormatSelected('online')}
              onCheckedChange={() => handleLearningFormatToggle('online')}
            />
            <Label htmlFor="format-online">Առցանց</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="format-classroom" 
              checked={isFormatSelected('classroom')}
              onCheckedChange={() => handleLearningFormatToggle('classroom')}
            />
            <Label htmlFor="format-classroom">Լսարանային</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="format-remote" 
              checked={isFormatSelected('remote')}
              onCheckedChange={() => handleLearningFormatToggle('remote')}
            />
            <Label htmlFor="format-remote">Հեռավար</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="format-hybrid" 
              checked={isFormatSelected('hybrid')}
              onCheckedChange={() => handleLearningFormatToggle('hybrid')}
            />
            <Label htmlFor="format-hybrid">Հիբրիդային</Label>
          </div>
        </div>
      </div>
      
      {/* Languages section */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Դասավանդման լեզուներ</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="lang-armenian" 
              checked={isLanguageSelected('armenian')}
              onCheckedChange={() => handleLanguageToggle('armenian')}
            />
            <Label htmlFor="lang-armenian">Հայերեն</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="lang-russian" 
              checked={isLanguageSelected('russian')}
              onCheckedChange={() => handleLanguageToggle('russian')}
            />
            <Label htmlFor="lang-russian">Ռուսերեն</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="lang-english" 
              checked={isLanguageSelected('english')}
              onCheckedChange={() => handleLanguageToggle('english')}
            />
            <Label htmlFor="lang-english">Անգլերեն</Label>
          </div>
        </div>
      </div>
      
      {/* Syllabus upload section */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Դասընթացի ծրագիր</h4>
        <div>
          <Label htmlFor="syllabus_file">Ծրագրի հղում (PDF)</Label>
          <Input
            id="syllabus_file"
            type="text"
            value={editedCourse.syllabus_file || ''}
            onChange={(e) => handleSyllabusUrlChange(e.target.value)}
            placeholder="https://example.com/syllabus.pdf"
            className="w-full mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Ներմուծեք դասընթացի ծրագրի PDF ֆայլի հղումը</p>
        </div>
      </div>
      
      {/* Resources section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium">Օգտակար ռեսուրսներ</h4>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addResource}
          >
            Ավելացնել ռեսուրս
          </Button>
        </div>
        
        {resources.length > 0 ? (
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <div key={index} className="flex items-center gap-2 border p-3 rounded-md">
                <div className="flex-1">
                  <Input 
                    placeholder="Ռեսուրսի վերնագիր" 
                    value={resource.title} 
                    onChange={(e) => updateResource(index, 'title', e.target.value)}
                    className="mb-2"
                  />
                  <Input 
                    placeholder="Ռեսուրսի հղում" 
                    value={resource.url} 
                    onChange={(e) => updateResource(index, 'url', e.target.value)}
                  />
                </div>
                <div>
                  <Select 
                    value={resource.type} 
                    onValueChange={(value) => updateResource(index, 'type', value as any)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Տեսակ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="link">Հղում</SelectItem>
                      <SelectItem value="document">Փաստաթուղթ</SelectItem>
                      <SelectItem value="video">Տեսանյութ</SelectItem>
                      <SelectItem value="other">Այլ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive"
                  onClick={() => removeResource(index)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Դեռ չկան օգտակար ռեսուրսներ</p>
        )}
      </div>
    </div>
  );
};
