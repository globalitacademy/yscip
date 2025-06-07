
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeBasicInfo from './ThemeBasicInfo';
import ThemeImages from './ThemeImages';
import ThemeContentType from './ThemeContentType';
import ThemeContent from './ThemeContent';
import ThemePublishToggle from './ThemePublishToggle';

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

interface ThemeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (theme: Theme) => void;
  theme: Theme;
  modules: { id: number; title: string }[];
  contentType: "text" | "video" | "both";
  setContentType: (type: "text" | "video" | "both") => void;
  embedYouTubeVideo: (url: string) => string;
}

const ThemeDialog: React.FC<ThemeDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  theme: initialTheme, 
  modules,
  contentType,
  setContentType,
  embedYouTubeVideo
}) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [activeTab, setActiveTab] = useState("basic-info");
  
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
  }, [isOpen, initialTheme, setContentType]);
  
  const handleSave = () => {
    onSave(theme);
  };

  const title = theme.id ? 'Խմբագրել թեման' : 'Ավելացնել նոր թեմա';

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
            <ThemeBasicInfo theme={theme} setTheme={setTheme} modules={modules} />
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
              embedYouTubeVideo={embedYouTubeVideo}
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
