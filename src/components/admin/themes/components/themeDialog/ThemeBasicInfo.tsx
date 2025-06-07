
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Theme {
  id?: string;
  title: string;
  summary: string;
  content?: string;
  image_url?: string;
  banner_image_url?: string;
  category?: string;
  module_id?: number;
  video_url?: string;
  is_published?: boolean;
}

interface ThemeBasicInfoProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  modules: { id: number; title: string }[];
}

const ThemeBasicInfo: React.FC<ThemeBasicInfoProps> = ({ theme, setTheme, modules }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTheme({ ...theme, [name]: value });
  };

  const handleModuleChange = (value: string) => {
    setTheme({ ...theme, module_id: value ? parseInt(value) : undefined });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Վերնագիր</Label>
          <Input
            id="title"
            name="title"
            value={theme.title}
            onChange={handleInputChange}
            placeholder="Թեմայի վերնագիր"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Կատեգորիա</Label>
          <Input
            id="category"
            name="category"
            value={theme.category || ''}
            onChange={handleInputChange}
            placeholder="օր․՝ Ծրագրավորում, Դիզայն"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="summary">Համառոտ նկարագրություն</Label>
        <Textarea
          id="summary"
          name="summary"
          value={theme.summary}
          onChange={handleInputChange}
          placeholder="Համառոտ նկարագրություն, որը կցուցադրվի թեմայի քարտի վրա"
          className="min-h-20"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="module">Մոդուլ</Label>
        <Select 
          value={theme.module_id?.toString() || ''} 
          onValueChange={handleModuleChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Ընտրեք մոդուլ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Մոդուլ չի ընտրված</SelectItem>
            {modules.map(module => (
              <SelectItem key={module.id} value={module.id.toString()}>
                {module.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default ThemeBasicInfo;
