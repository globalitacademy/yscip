
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Theme } from '../hooks/useThemeManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import RichTextEditor from '../../common/RichTextEditor';

const themeFormSchema = z.object({
  title: z.string().min(2, { message: "Վերնագիրը պետք է ունենա առնվազն 2 նիշ" }),
  summary: z.string().min(10, { message: "Ամփոփումը պետք է ունենա առնվազն 10 նիշ" }),
  content: z.string(),
  category: z.string().min(2, { message: "Կատեգորիան պետք է ունենա առնվազն 2 նիշ" }),
  image_url: z.string().url({ message: "Խնդրում ենք նշել վավեր URL" }).or(z.string().length(0)),
  is_published: z.boolean().default(false),
});

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
  
  const form = useForm<z.infer<typeof themeFormSchema>>({
    resolver: zodResolver(themeFormSchema),
    defaultValues: {
      title: selectedTheme?.title || '',
      summary: selectedTheme?.summary || '',
      content: selectedTheme?.content || '',
      category: selectedTheme?.category || '',
      image_url: selectedTheme?.image_url || '',
      is_published: selectedTheme?.is_published || false,
    },
  });

  React.useEffect(() => {
    if (selectedTheme) {
      form.reset({
        title: selectedTheme.title || '',
        summary: selectedTheme.summary || '',
        content: selectedTheme.content || '',
        category: selectedTheme.category || '',
        image_url: selectedTheme.image_url || '',
        is_published: selectedTheme.is_published || false,
      });
    }
  }, [selectedTheme, form]);

  const handleFormSubmit = (data: z.infer<typeof themeFormSchema>) => {
    if (selectedTheme) {
      onThemeChange({
        ...selectedTheme,
        ...data
      });
      onSave();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNewTheme ? 'Նոր թեմա' : 'Թարմացնել թեման'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">Հիմնական</TabsTrigger>
                <TabsTrigger value="content">Բովանդակություն</TabsTrigger>
                <TabsTrigger value="settings">Կարգավորումներ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Վերնագիր</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ամփոփում</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormDescription>Համառոտ նկարագրություն թեմայի վերաբերյալ</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Կատեգորիա</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Բովանդակություն</FormLabel>
                      <FormControl>
                        <RichTextEditor 
                          value={field.value} 
                          onChange={field.onChange} 
                          className="min-h-[400px] border rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Նկարի URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/image.jpg" />
                      </FormControl>
                      <FormDescription>Թեմայի ներկայացման նկարի հղում</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Հրապարակված
                        </FormLabel>
                        <FormDescription>
                          Նշելու դեպքում թեման տեսանելի կլինի բոլոր օգտատերերին
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Չեղարկել
              </Button>
              <Button type="submit">
                {isNewTheme ? 'Ստեղծել' : 'Պահպանել'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeDialog;
