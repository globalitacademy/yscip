
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Theme } from '../../hooks/useThemeManagement';
import ThemeBasicInfo from './ThemeBasicInfo';
import ThemeImages from './ThemeImages';
import ThemeContentType from './ThemeContentType';
import ThemeContent from './ThemeContent';
import ThemePublishToggle from './ThemePublishToggle';

interface ThemeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme | null;
  onSave: () => void;
  setTheme: (theme: Theme | null) => void;
  modules: { id: number; title: string }[];
  contentType: 'text' | 'video' | 'both';
  setContentType: (type: 'text' | 'video' | 'both') => void;
  embedYouTubeVideo: (url: string) => string;
}

const ThemeDialog: React.FC<ThemeDialogProps> = ({
  isOpen,
  onClose,
  theme,
  onSave,
  setTheme,
  modules,
  contentType,
  setContentType,
  embedYouTubeVideo
}) => {
  if (!theme) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{theme.id ? 'Թարմացնել թեման' : 'Ստեղծել նոր թեմա'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Basic information (title, category, summary, module) */}
          <ThemeBasicInfo 
            theme={theme} 
            setTheme={setTheme} 
            modules={modules} 
          />
          
          {/* Image uploaders */}
          <ThemeImages 
            theme={theme} 
            setTheme={setTheme} 
          />
          
          {/* Content type selector */}
          <ThemeContentType 
            contentType={contentType} 
            setContentType={setContentType}
            theme={theme}
            setTheme={setTheme}
          />
          
          {/* Content editor (rich text, video) */}
          <ThemeContent 
            theme={theme} 
            setTheme={setTheme} 
            contentType={contentType}
            embedYouTubeVideo={embedYouTubeVideo}
          />
          
          {/* Publish toggle */}
          <ThemePublishToggle 
            theme={theme} 
            setTheme={setTheme} 
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Չեղարկել</Button>
          <Button onClick={onSave}>Պահպանել</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeDialog;
