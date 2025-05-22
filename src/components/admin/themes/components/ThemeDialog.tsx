import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUploader from '@/components/common/image-uploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Theme } from '../hooks/useThemeManagement';
import RichTextEditor from '@/components/admin/common/RichTextEditor';

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
  const [localContent, setLocalContent] = React.useState('');
  const [videoUrl, setVideoUrl] = React.useState('');
  
  useEffect(() => {
    if (theme?.content) {
      setLocalContent(theme.content);
    }
    if (theme?.video_url) {
      setVideoUrl(theme.video_url || '');
    }
  }, [theme]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!theme) return;
    const { name, value } = e.target;
    setTheme({ ...theme, [name]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    if (!theme) return;
    setTheme({ ...theme, is_published: checked });
  };

  const handleModuleChange = (value: string) => {
    if (!theme) return;
    setTheme({ ...theme, module_id: value ? parseInt(value) : undefined });
  };

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

  const handleContentTypeChange = (value: string) => {
    setContentType(value as 'text' | 'video' | 'both');
    
    if (!theme) return;
    
    if (value === 'text') {
      // Keep only text content
      setTheme({ ...theme, content: localContent, video_url: undefined });
    } else if (value === 'video') {
      // Convert to video embed
      const videoEmbed = embedYouTubeVideo(videoUrl);
      setTheme({ ...theme, content: videoEmbed, video_url: videoUrl });
    } else if (value === 'both') {
      // Combine text content with video embed
      const videoEmbed = embedYouTubeVideo(videoUrl);
      const combinedContent = `${localContent}\n\n${videoEmbed}`;
      setTheme({ ...theme, content: combinedContent, video_url: videoUrl });
    }
  };

  const handleMainImageChange = (imageUrl: string) => {
    if (!theme) return;
    setTheme({ ...theme, image_url: imageUrl });
  };

  const handleBannerImageChange = (imageUrl: string) => {
    if (!theme) return;
    setTheme({ ...theme, banner_image_url: imageUrl });
  };

  if (!theme) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{theme.id ? 'Թարմացնել թեման' : 'Ստեղծել նոր թեմա'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
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
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Հիմնական նկար</Label>
              <ImageUploader
                currentImage={theme.image_url}
                onImageChange={handleMainImageChange}
                placeholder="Կցել հիմնական նկար"
                aspectRatio={16/9}
              />
              <p className="text-xs text-muted-foreground">
                Թեմայի քարտի վրա ցուցադրվող նկար
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Բաներ</Label>
              <ImageUploader
                currentImage={theme.banner_image_url}
                onImageChange={handleBannerImageChange}
                placeholder="Կցել բաներ"
                aspectRatio={21/9}
              />
              <p className="text-xs text-muted-foreground">
                Թեմայի էջի վերևի հատվածում ցուցադրվող մեծ նկար
              </p>
            </div>
          </div>
          
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
                      src={`https://www.youtube.com/embed/${videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\s]+)/)?.[1] || ''}`}
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
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_published"
              checked={theme.is_published || false}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="is_published">Հրապարակել</Label>
          </div>
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
