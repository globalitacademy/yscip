import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Theme } from '../../hooks/useThemeManagement';

interface ThemeContentTypeProps {
  contentType: 'text' | 'video' | 'both';
  setContentType: (type: 'text' | 'video' | 'both') => void;
  theme: Theme;
  setTheme: (theme: Theme | null) => void;
}

const ThemeContentType: React.FC<ThemeContentTypeProps> = ({ 
  contentType, 
  setContentType,
  theme,
  setTheme
}) => {
  const handleContentTypeChange = (value: string) => {
    setContentType(value as 'text' | 'video' | 'both');
    
    if (!theme) return;
    
    if (value === 'text') {
      // Keep only text content
      setTheme({ ...theme, content: theme.content, video_url: undefined });
    } else if (value === 'video') {
      // Convert to video embed
      const videoEmbed = theme.video_url ? embedYouTubeVideo(theme.video_url) : '';
      setTheme({ ...theme, content: videoEmbed });
    } else if (value === 'both') {
      // Combine text content with video embed
      const videoEmbed = theme.video_url ? embedYouTubeVideo(theme.video_url) : '';
      const combinedContent = `${theme.content}\n\n${videoEmbed}`;
      setTheme({ ...theme, content: combinedContent });
    }
  };

  // Helper function to embed YouTube video
  const embedYouTubeVideo = (url: string): string => {
    // Extract video ID from YouTube URL
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\s]+)/);
    if (match && match[1]) {
      const videoId = match[1];
      // Return the video content as HTML
      return `<div class="aspect-w-16 aspect-h-9 my-8">
        <iframe width="100%" height="450" src="https://www.youtube.com/embed/${videoId}" 
         frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
         allowfullscreen></iframe>
      </div>`;
    }
    return '';
  };

  return (
    <div className="space-y-2">
      <Label>Բովանդակության տեսակ</Label>
      <Select value={contentType} onValueChange={handleContentTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Ընտրեք բովանդակության տեսակը" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">Միայն տեքստ</SelectItem>
          <SelectItem value="video">Միայն տեսանյութ</SelectItem>
          <SelectItem value="both">Տեքստ և տեսանյութ</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ThemeContentType;
