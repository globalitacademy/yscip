
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, Upload } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

interface MediaUploaderProps {
  mediaUrl?: string;
  onMediaChange: (url: string) => void;
  label: string;
  uploadLabel?: string;
  placeholder?: string;
  previewHeight?: string;
  showIconOption?: boolean;
  iconSelector?: React.ReactNode;
  defaultTab?: 'icon' | 'upload' | 'url';
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  mediaUrl,
  onMediaChange,
  label,
  uploadLabel = 'Ներբեռնել',
  placeholder = 'https://example.com/image.jpg',
  previewHeight = 'max-h-40',
  showIconOption = false,
  iconSelector,
  defaultTab = 'upload'
}) => {
  const [mediaOption, setMediaOption] = React.useState<'icon' | 'upload' | 'url'>(
    mediaUrl ? 'url' : defaultTab
  );
  const { theme } = useTheme();
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onMediaChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [];
  if (showIconOption) tabs.push(<TabsTrigger key="icon" value="icon">Պատկերակ</TabsTrigger>);
  tabs.push(<TabsTrigger key="upload" value="upload">Ներբեռնել</TabsTrigger>);
  tabs.push(<TabsTrigger key="url" value="url">URL</TabsTrigger>);

  return (
    <div>
      <Label>{label}</Label>
      <Tabs value={mediaOption} onValueChange={(value: 'icon' | 'upload' | 'url') => setMediaOption(value)} className="w-full">
        <TabsList className={`grid w-full grid-cols-${showIconOption ? '3' : '2'}`}>
          {tabs}
        </TabsList>
        
        {showIconOption && (
          <TabsContent value="icon">
            {iconSelector}
          </TabsContent>
        )}
        
        <TabsContent value="upload">
          <div className={`border rounded-md p-4 text-center ${theme === 'dark' 
            ? 'bg-gray-800 border-gray-700 text-gray-200' 
            : 'bg-white border-gray-200'}`}
          >
            <label htmlFor={`${label}Upload`} className="cursor-pointer flex flex-col items-center">
              <Upload className={`h-8 w-8 mb-2 ${theme === 'dark' ? 'text-amber-500' : 'text-amber-700'}`} />
              <span>{uploadLabel}</span>
              <input
                id={`${label}Upload`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            {mediaUrl && (
              <div className="mt-4">
                <img 
                  src={mediaUrl} 
                  alt="Media Preview" 
                  className={`${previewHeight} mx-auto`}
                />
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="url">
          <div className={`border rounded-md p-4 ${theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-center">
              <Link className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-amber-500' : 'text-amber-700'}`} />
              <Input
                value={mediaUrl || ''}
                onChange={(e) => onMediaChange(e.target.value)}
                placeholder={placeholder}
                className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}
              />
            </div>
            {mediaUrl && (
              <div className="mt-4">
                <img 
                  src={mediaUrl} 
                  alt="Media Preview" 
                  className={`${previewHeight} mx-auto`}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
