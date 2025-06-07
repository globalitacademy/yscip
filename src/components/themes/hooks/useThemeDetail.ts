
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Theme {
  id: string;
  title: string;
  summary: string;
  content?: string;
  image_url?: string;
  banner_image_url?: string;
  category?: string;
  module_id?: number;
  created_at?: string;
  updated_at?: string;
  video_url?: string;
}

export const useThemeDetail = (id?: string) => {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedThemes, setRelatedThemes] = useState<Theme[]>([]);
  const [moduleTitle, setModuleTitle] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('content');
  
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        setIsLoading(true);
        
        // First get the theme
        const { data: themeData, error } = await supabase
          .from('themes')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (themeData) {
          // If theme has a module_id, get the module title
          if (themeData.module_id) {
            const { data: moduleData } = await supabase
              .from('educational_modules')
              .select('title')
              .eq('id', themeData.module_id)
              .single();
              
            if (moduleData) {
              setModuleTitle(moduleData.title);
            }
            
            // Get related themes from the same module
            const { data: relatedData } = await supabase
              .from('themes')
              .select('id, title, summary, category, image_url')
              .eq('module_id', themeData.module_id)
              .neq('id', id)
              .limit(3);
              
            if (relatedData) {
              setRelatedThemes(relatedData);
            }
          }
          
          setTheme(themeData);
          
          // Determine initial active tab
          if (themeData.content && themeData.content.includes('youtube.com/embed')) {
            setActiveTab('video');
          } else if (themeData.content) {
            setActiveTab('content');
          } else if (themeData.image_url) {
            setActiveTab('images');
          }
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchTheme();
    }
  }, [id]);
  
  // Extract YouTube video ID from video URL if exists
  const extractYouTubeVideoId = (videoUrl?: string): string | null => {
    if (!videoUrl) return null;
    
    // Match YouTube URLs
    const urlMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^"'&?\/\s]+)/);
    if (urlMatch && urlMatch[1]) return urlMatch[1];
    
    // Match YouTube embed URLs
    const embedMatch = videoUrl.match(/youtube\.com\/embed\/([^"'&?\/\s]+)/);
    if (embedMatch && embedMatch[1]) return embedMatch[1];
    
    return null;
  };
  
  // Check if content has embedded video
  const contentHasEmbeddedVideo = (content?: string): boolean => {
    if (!content) return false;
    return content.includes('youtube.com/embed');
  };
  
  // Get video ID from content if available
  const videoId = theme?.content && contentHasEmbeddedVideo(theme.content)
    ? extractYouTubeVideoId(theme.content)
    : null;

  return {
    theme,
    moduleTitle,
    relatedThemes,
    activeTab,
    setActiveTab,
    isLoading,
    videoId,
    contentHasEmbeddedVideo: (content?: string) => contentHasEmbeddedVideo(content)
  };
};
