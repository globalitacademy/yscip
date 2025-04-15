
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Theme } from '../hooks/useThemeManagement';

interface ThemeDialogProps {
  open: boolean;
  selectedTheme: Theme | null;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onThemeChange: (theme: Theme) => void;
}

const ThemeDialog: React.FC<ThemeDialogProps> = ({
  open,
  selectedTheme,
  onOpenChange,
  onSave,
  onThemeChange
}) => {
  const isNewTheme = !selectedTheme?.id;
  
  const handleInputChange = (field: keyof Theme, value: any) => {
    if (!selectedTheme) return;
    
    onThemeChange({
      ...selectedTheme,
      [field]: value
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isNewTheme ? 'Նոր թեմա' : 'Թարմացնել թեման'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Վերնագիր</Label>
            <Input 
              id="title" 
              value={selectedTheme?.title || ''} 
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="summary">Ամփոփում</Label>
            <Textarea 
              id="summary" 
              value={selectedTheme?.summary || ''} 
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content">Բովանդակություն</Label>
            <Textarea 
              id="content" 
              value={selectedTheme?.content || ''} 
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={6}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Կատեգորիա</Label>
            <Input 
              id="category" 
              value={selectedTheme?.category || ''} 
              onChange={(e) => handleInputChange('category', e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="image_url">Նկարի URL</Label>
            <Input 
              id="image_url" 
              value={selectedTheme?.image_url || ''} 
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is_published" 
              checked={selectedTheme?.is_published || false}
              onCheckedChange={(checked) => 
                handleInputChange('is_published', checked === true)
              }
            />
            <label
              htmlFor="is_published"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Հրապարակված
            </label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Չեղարկել
          </Button>
          <Button type="submit" onClick={onSave}>
            {isNewTheme ? 'Ստեղծել' : 'Պահպանել'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeDialog;
