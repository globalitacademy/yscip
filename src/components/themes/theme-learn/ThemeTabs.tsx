
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Video, Image } from 'lucide-react';
import { Theme } from '../hooks/useThemeDetail';
import TextContent from './tabs/TextContent';
import VideoContent from './tabs/VideoContent';
import ImageContent from './tabs/ImageContent';

interface ThemeTabsProps {
  theme: Theme;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  videoId: string | null;
  contentHasEmbeddedVideo: (content?: string) => boolean;
}

const ThemeTabs: React.FC<ThemeTabsProps> = ({ 
  theme, 
  activeTab, 
  setActiveTab, 
  videoId,
  contentHasEmbeddedVideo
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
      <TabsList className="mb-6">
        {theme.content && !contentHasEmbeddedVideo(theme.content) && (
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Տեքստային Նյութ</span>
          </TabsTrigger>
        )}
        {(videoId || theme.video_url) && (
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span>Տեսադաս</span>
          </TabsTrigger>
        )}
        {theme.image_url && (
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            <span>Նկարներ</span>
          </TabsTrigger>
        )}
      </TabsList>
      
      {theme.content && !contentHasEmbeddedVideo(theme.content) && (
        <TabsContent value="content">
          <TextContent content={theme.content} />
        </TabsContent>
      )}
      
      {(videoId || theme.video_url) && (
        <TabsContent value="video">
          <VideoContent 
            theme={theme} 
            videoId={videoId} 
            contentHasEmbeddedVideo={contentHasEmbeddedVideo} 
          />
        </TabsContent>
      )}
      
      {theme.image_url && (
        <TabsContent value="images">
          <ImageContent theme={theme} />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default ThemeTabs;
