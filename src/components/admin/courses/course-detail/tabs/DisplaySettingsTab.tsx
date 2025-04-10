
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Calendar, Clock, FolderOpen, RefreshCw } from 'lucide-react'; 
import { format } from 'date-fns';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  const handleSelectChange = (field: string, value: string) => {
    setEditedCourse({ ...editedCourse, [field]: value });
  };

  // Calculate number of lessons
  const lessonsCount = editedCourse.lessons?.length || 0;

  // Format dates if they exist
  const createdAtFormatted = editedCourse.createdAt 
    ? format(new Date(editedCourse.createdAt), 'dd/MM/yyyy HH:mm')
    : 'Անհայտ';
    
  const updatedAtFormatted = editedCourse.updatedAt 
    ? format(new Date(editedCourse.updatedAt), 'dd/MM/yyyy HH:mm')
    : 'Անհայտ';

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Ցուցադրման կարգավորումներ</h3>
      
      {/* Publication settings */}
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
      
      {/* Display order and color settings */}
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

      {/* New Added Fields */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-md font-medium">Դասընթացի լրացուցիչ տվյալներ</h4>

        {/* Category field */}
        <div>
          <Label htmlFor="category" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" /> Կատեգորիա
          </Label>
          <Input
            id="category"
            value={editedCourse.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value)}
            placeholder="Օրինակ՝ Ծրագրավորում, Դիզայն, ևն"
            className="mt-1"
          />
        </div>
        
        {/* Format selection */}
        <div>
          <Label htmlFor="format">Ուսուցման ձևաչափ</Label>
          <Select
            value={editedCourse.format || 'online'}
            onValueChange={(value) => handleSelectChange('format', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Ընտրել ձևաչափը" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="online">Առցանց</SelectItem>
                <SelectItem value="classroom">Լսարանային</SelectItem>
                <SelectItem value="hybrid">Հիբրիդային</SelectItem>
                <SelectItem value="remote">Հեռավար</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Language selection */}
        <div>
          <Label htmlFor="language">Դասավանդման լեզու</Label>
          <Select
            value={editedCourse.language || 'armenian'}
            onValueChange={(value) => handleSelectChange('language', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Ընտրել լեզուն" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="armenian">Հայերեն</SelectItem>
                <SelectItem value="english">Անգլերեն</SelectItem>
                <SelectItem value="russian">Ռուսերեն</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Lessons count - Read only */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Դասերի քանակ: {lessonsCount}</span>
        </div>

        {/* Created and Updated dates - Read only */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Ստեղծվել է: {createdAtFormatted}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4" />
            <span>Թարմացվել է: {updatedAtFormatted}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
