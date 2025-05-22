
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/admin/common/RichTextEditor';
import { Theme } from '../../hooks/useThemeManagement';

interface ThemeContentProps {
  theme: Theme;
  setTheme: (theme: Theme | null) => void;
  contentType: 'text' | 'video' | 'both';
  embedYouTubeVideo: (url: string) => string;
}

const ThemeContent: React.FC<ThemeContentProps> = ({ 
  theme, 
  setTheme, 
  contentType,
  embedYouTubeVideo
}) => {
  const [localContent, setLocalContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  
  useEffect(() => {
    if (theme.content) {
      setLocalContent(theme.content);
    }
    if (theme.video_url) {
      setVideoUrl(theme.video_url || '');
    }
  }, [theme]);

  const handleContentChange = (content: string) => {
    setLocalContent(content);
    if (!theme) return;
    
    // Combine rich text content with video embed if both are selected
    if (contentType === 'both' && videoUrl) {
      const videoEmbed = embedYouTubeVideo(videoUrl);
      const combinedContent = `${content}\n\n${videoEmbed}`;
      setTheme({ ...theme, content: combinedContent, video_url: videoUrl });
    } else {
      setTheme({ ...theme, content });
    }
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    
    if (!theme) return;
    
    // Update theme with video URL
    setTheme({ ...theme, video_url: url });
    
    // If content type is both, embed the video in the content
    if (contentType === 'both') {
      const videoEmbed = embedYouTubeVideo(url);
      const combinedContent = `${localContent}\n\n${videoEmbed}`;
      setTheme({ ...theme, content: combinedContent, video_url: url });
    } else if (contentType === 'video') {
      // If content type is video only, replace content with video embed
      const videoEmbed = embedYouTubeVideo(url);
      setTheme({ ...theme, content: videoEmbed, video_url: url });
    }
  };

  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url: string): string => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\s]+)/);
    return match && match[1] ? match[1] : '';
  };

  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="content">Բովանդակություն</TabsTrigger>
        {(contentType === 'video' || contentType === 'both') && (
          <TabsTrigger value="video">Տեսանյութ</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="content" className="space-y-4">
        {(contentType === 'text' || contentType === 'both') && (
          <div className="space-y-2">
            <Label htmlFor="content">Թեմայի բովանդակություն</Label>
            <div className="min-h-[300px] border rounded-md">
              <RichTextEditor
                value={localContent}
                onChange={handleContentChange}
                placeholder="Թեմայի մանրամասն բովանդակություն..."
              />
            </div>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="video" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="videoUrl">YouTube տեսանյութի հղում</Label>
          <Input
            id="videoUrl"
            name="videoUrl"
            value={videoUrl}
            onChange={handleVideoUrlChange}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p className="text-xs text-muted-foreground">
            Տեղադրեք YouTube տեսանյութի հղումը։ Այն ավտոմատ կներկառուցվի թեմայի էջում։
          </p>
        </div>
        
        {videoUrl && (
          <div className="mt-4 border rounded-md p-4">
            <p className="text-sm font-medium mb-2">Տեսանյութի նախադիտում</p>
            <div className="aspect-video bg-muted rounded-md">
              <iframe 
                src={`https://www.youtube.com/embed/${getYoutubeVideoId(videoUrl)}`}
                className="w-full h-full rounded-md"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ThemeContent;
