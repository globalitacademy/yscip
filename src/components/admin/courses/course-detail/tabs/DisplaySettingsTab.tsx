
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
    </div>
  );
};

export { DisplaySettingsTab };
