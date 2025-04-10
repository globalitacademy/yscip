
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';

interface DisplaySettingsTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
}

export const DisplaySettingsTab: React.FC<DisplaySettingsTabProps> = ({
  editedCourse,
  setEditedCourse
}) => {
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setEditedCourse({ ...editedCourse, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Ցուցադրման կարգավորումներ</h3>
      
      <div className="grid grid-cols-1 gap-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="is_public" className="flex-1">Հրապարակային դասընթաց</Label>
            <Switch
              id="is_public"
              checked={editedCourse.is_public || false}
              onCheckedChange={(checked) => handleInputChange('is_public', checked)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Միացրեք, եթե դասընթացը պետք է հասանելի լինի բոլորին։ Անջատեք, եթե դասընթացը դեռ պատրաստ չէ հրապարակման։
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="show_on_homepage" className="flex-1">Ցուցադրել գլխավոր էջում</Label>
            <Switch
              id="show_on_homepage"
              checked={editedCourse.show_on_homepage || false}
              onCheckedChange={(checked) => handleInputChange('show_on_homepage', checked)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Միացրեք, եթե դասընթացը պետք է ցուցադրվի գլխավոր էջի "Դասընթացներ" բաժնում։
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_order">Ցուցադրման հերթականություն</Label>
          <Input
            id="display_order"
            type="number"
            min={0}
            value={editedCourse.display_order || 0}
            onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
            placeholder="0"
          />
          <p className="text-sm text-muted-foreground">
            Ավելի փոքր արժեքով դասընթացները ցուցադրվում են առաջին հերթին։
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL հասցե (slug)</Label>
          <Input
            id="slug"
            value={editedCourse.slug || ''}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="course-name"
          />
          <p className="text-sm text-muted-foreground">
            Կարճ հասցե, որը կօգտագործվի URL-ում։ Օրինակ՝ "machine-learning-basics"
          </p>
        </div>
      </div>
    </div>
  );
};
