
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Theme } from '../../../hooks/useThemeManagement';
import ThemeBasicInfo from './ThemeBasicInfo';
import ThemeImages from './ThemeImages';
import ThemeContentType from './ThemeContentType';
import ThemeContent from './ThemeContent';
import ThemePublishToggle from './ThemePublishToggle';

interface ThemeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (theme: Theme) => void;
  theme: Theme;
  title: string;
  isEditing: boolean;
}

const ThemeDialog: React.FC<ThemeDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  theme: initialTheme, 
  title,
  isEditing
}) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [activeTab, setActiveTab] = useState("basic-info");
  const [contentType, setContentType] = useState<"text" | "video" | "both">("text");
  
  // Reset form when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      setTheme(initialTheme);
      
      // Set initial content type based on theme data
      if (initialTheme.content && initialTheme.video_url) {
        setContentType("both");
      } else if (initialTheme.video_url) {
        setContentType("video");
      } else {
        setContentType("text");
      }
    }
  }, [isOpen, initialTheme]);
  
  const handleSave = () => {
    onSave(theme);
  };
  
  // Embed YouTube video in content
  const embedYouTubeVideo = (videoUrl: string) => {
    if (!videoUrl) return;
    
    // Extract video ID
    const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^"&?\/\s]+)/);
    if (!match || !match[1]) return;
    
    const videoId = match[1];
    const embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    
    // Add embed code to content
    setTheme({
      ...theme,
      content: theme.content ? `${theme.content}\n\n${embedCode}` : embedCode
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="basic-info">Հիմնական տվյալներ</TabsTrigger>
            <TabsTrigger value="images">Նկարներ</TabsTrigger>
            <TabsTrigger value="content">Բովանդակություն</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic-info">
            <ThemeBasicInfo theme={theme} setTheme={setTheme} />
          </TabsContent>
          
          <TabsContent value="images">
            <ThemeImages theme={theme} setTheme={setTheme} />
          </TabsContent>
          
          <TabsContent value="content">
            <ThemeContentType 
              contentType={contentType} 
              setContentType={setContentType} 
              theme={theme} 
              setTheme={setTheme}
              embedYouTubeVideo={embedYouTubeVideo}
            />
            <ThemeContent 
              contentType={contentType} 
              theme={theme} 
              setTheme={setTheme} 
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex flex-col gap-6">
          <ThemePublishToggle theme={theme} setTheme={setTheme} />
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Չեղարկել</Button>
            <Button onClick={handleSave}>Պահպանել</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeDialog;
