
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Theme } from '../../../hooks/useThemeManagement';

export interface ThemeContentTypeProps {
  contentType: "text" | "video" | "both";
  setContentType: (type: "text" | "video" | "both") => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  embedYouTubeVideo: (videoUrl: string) => void;
}

const ThemeContentType: React.FC<ThemeContentTypeProps> = ({ 
  contentType, 
  setContentType, 
  theme, 
  setTheme,
  embedYouTubeVideo 
}) => {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <Label htmlFor="content-type">Նյութի տեսակ</Label>
        <RadioGroup
          id="content-type"
          value={contentType}
          onValueChange={(value) => setContentType(value as "text" | "video" | "both")}
          className="flex gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="text" />
            <Label htmlFor="text">Միայն տեքստ</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video" id="video" />
            <Label htmlFor="video">Միայն տեսանյութ</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both">Տեքստ և տեսանյութ</Label>
          </div>
        </RadioGroup>
      </div>
      
      {(contentType === "video" || contentType === "both") && (
        <div className="space-y-2">
          <Label htmlFor="video-url">YouTube տեսանյութի հղում</Label>
          <div className="flex gap-2">
            <Input
              id="video-url"
              placeholder="https://youtube.com/watch?v=..."
              value={theme.video_url || ''}
              onChange={(e) => setTheme({ ...theme, video_url: e.target.value })}
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={() => embedYouTubeVideo(theme.video_url || '')}
            >
              Ներդնել տեքստում
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeContentType;
