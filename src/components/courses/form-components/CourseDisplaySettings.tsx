
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ProfessionalCourse } from '../types/ProfessionalCourse';

interface CourseDisplaySettingsProps {
  course: Partial<ProfessionalCourse>;
  setCourse: (course: Partial<ProfessionalCourse>) => void;
}

export const CourseDisplaySettings: React.FC<CourseDisplaySettingsProps> = ({ course, setCourse }) => {
  return (
    <div className="border rounded-md p-4 space-y-4">
      <h3 className="text-lg font-medium mb-2">Ցուցադրման կարգավորումներ</h3>
      
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="is_public" className="font-medium">Հրապարակային դասընթաց</Label>
          <p className="text-sm text-muted-foreground">Դասընթացը տեսանելի կլինի բոլոր օգտատերերին</p>
        </div>
        <Switch 
          id="is_public" 
          checked={course.is_public || false}
          onCheckedChange={(checked) => setCourse({ ...course, is_public: checked })}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="show_on_homepage" className="font-medium">Ցուցադրել գլխավոր էջում</Label>
          <p className="text-sm text-muted-foreground">Դասընթացը կցուցադրվի գլխավոր էջի դասընթացների բաժնում</p>
        </div>
        <Switch 
          id="show_on_homepage" 
          checked={course.show_on_homepage || false}
          onCheckedChange={(checked) => setCourse({ ...course, show_on_homepage: checked })}
        />
      </div>
      
      <div>
        <Label htmlFor="display_order">Ցուցադրման հերթականություն</Label>
        <Input
          id="display_order"
          type="number"
          min="0"
          value={course.display_order || 0}
          onChange={(e) => setCourse({ ...course, display_order: parseInt(e.target.value) || 0 })}
          placeholder="0"
          className="w-24"
        />
        <p className="text-xs text-muted-foreground mt-1">Ավելի փոքր թվով դասընթացները ցուցադրվում են առաջինը</p>
      </div>
    </div>
  );
};
