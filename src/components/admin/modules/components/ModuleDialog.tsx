
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { EducationalModule } from '@/components/educationalCycle';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import RichTextEditor from '../../common/RichTextEditor';

interface ModuleDialogProps {
  open: boolean;
  selectedModule: EducationalModule | null;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onModuleChange: (module: EducationalModule | null) => void;
}

const ModuleDialog: React.FC<ModuleDialogProps> = ({
  open,
  selectedModule,
  onOpenChange,
  onSave,
  onModuleChange
}) => {
  const [newTopic, setNewTopic] = React.useState('');
  const [useRichEditor, setUseRichEditor] = React.useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedModule) {
      onModuleChange({
        ...selectedModule,
        title: e.target.value
      });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedModule) {
      onModuleChange({
        ...selectedModule,
        description: e.target.value
      });
    }
  };

  const handleRichDescriptionChange = (content: string) => {
    if (selectedModule) {
      onModuleChange({
        ...selectedModule,
        description: content
      });
    }
  };

  const handleStatusChange = (value: string) => {
    if (selectedModule) {
      onModuleChange({
        ...selectedModule,
        status: value as 'not-started' | 'in-progress' | 'completed'
      });
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedModule) {
      onModuleChange({
        ...selectedModule,
        progress: parseInt(e.target.value, 10)
      });
    }
  };

  const handleAddTopic = () => {
    if (!newTopic || !selectedModule) return;

    onModuleChange({
      ...selectedModule,
      topics: [...(selectedModule.topics || []), newTopic]
    });
    setNewTopic('');
  };

  const handleRemoveTopic = (index: number) => {
    if (!selectedModule) return;

    const updatedTopics = [...(selectedModule.topics || [])];
    updatedTopics.splice(index, 1);
    onModuleChange({
      ...selectedModule,
      topics: updatedTopics
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedModule?.id ? 'Խմբագրել մոդուլը' : 'Ավելացնել նոր մոդուլ'}
          </DialogTitle>
          <DialogDescription>
            {selectedModule?.id 
              ? 'Փոփոխեք մոդուլի տվյալները ստորև' 
              : 'Լրացրեք նոր մոդուլի տվյալները'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Հիմնական</TabsTrigger>
            <TabsTrigger value="topics">Թեմաներ</TabsTrigger>
            <TabsTrigger value="settings">Կարգավորումներ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Վերնագիր</Label>
                <Input 
                  id="title" 
                  value={selectedModule?.title || ''} 
                  onChange={handleTitleChange} 
                  placeholder="Մուտքագրեք մոդուլի վերնագիրը"
                />
              </div>
              
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="description">Նկարագրություն</Label>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="rich-editor" className="text-sm">Հարուստ տեքստի խմբագրիչ</Label>
                    <Switch 
                      id="rich-editor"
                      checked={useRichEditor}
                      onCheckedChange={setUseRichEditor}
                    />
                  </div>
                </div>
                
                {useRichEditor ? (
                  <RichTextEditor 
                    value={selectedModule?.description || ''}
                    onChange={handleRichDescriptionChange}
                    className="min-h-[200px]"
                  />
                ) : (
                  <Textarea 
                    id="description" 
                    value={selectedModule?.description || ''} 
                    onChange={handleDescriptionChange} 
                    placeholder="Մուտքագրեք մոդուլի նկարագրությունը"
                    className="min-h-[100px]"
                  />
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="topics">
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label>Թեմաներ</Label>
                <div className="flex flex-wrap gap-2 mb-2 min-h-[60px] p-2 border rounded-md">
                  {selectedModule?.topics?.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {topic}
                      <button 
                        onClick={() => handleRemoveTopic(index)}
                        className="ml-1 hover:text-destructive"
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {selectedModule?.topics?.length === 0 && (
                    <div className="text-sm text-muted-foreground p-2">Ավելացրեք թեմաներ մոդուլի համար</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Նոր թեմա"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTopic())}
                  />
                  <Button type="button" size="icon" onClick={handleAddTopic}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Կարգավիճակ</Label>
                <Select 
                  value={selectedModule?.status || 'not-started'} 
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Ընտրեք կարգավիճակը" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-started">Չսկսված</SelectItem>
                    <SelectItem value="in-progress">Ընթացքի մեջ է</SelectItem>
                    <SelectItem value="completed">Ավարտված է</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="progress">Առաջընթաց (%)</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    id="progress" 
                    type="range"
                    min="0" 
                    max="100" 
                    value={selectedModule?.progress || 0} 
                    onChange={handleProgressChange} 
                    className="flex-1"
                  />
                  <span className="w-12 text-center font-medium">{selectedModule?.progress || 0}%</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Չեղարկել</Button>
          <Button onClick={onSave}>Պահպանել</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleDialog;
