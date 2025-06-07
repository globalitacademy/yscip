
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Theme } from '../../hooks/useThemeManagement';

interface ThemePublishToggleProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemePublishToggle: React.FC<ThemePublishToggleProps> = ({ theme, setTheme }) => {
  const handleSwitchChange = (checked: boolean) => {
    setTheme({ ...theme, is_published: checked });
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="is_published"
        checked={theme.is_published || false}
        onCheckedChange={handleSwitchChange}
      />
      <Label htmlFor="is_published">Հրապարակել</Label>
    </div>
  );
};

export default ThemePublishToggle;
