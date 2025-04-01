import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckIcon, ChevronsUpDown, Phone, Mail, User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useCourseApplications } from '@/hooks/useCourseApplications';
import { ProfessionalCourse } from '../types';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface CourseApplicationFormProps {
  course: ProfessionalCourse;
  onClose?: () => void;
  isOpen?: boolean;
}

const CourseApplicationForm: React.FC<CourseApplicationFormProps> = ({ 
  course, 
  onClose,
  isOpen = false
}) => {
  const { submitApplication } = useCourseApplications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    message: '',
    format: '',
    session_type: '',
    languages: [] as string[],
    free_practice: true
  });
  const [openFormat, setOpenFormat] = useState(false);
  const [openSessionType, setOpenSessionType] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(isOpen);

  React.useEffect(() => {
    setDialogOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setDialogOpen(false);
    if (onClose) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.full_name.trim() === '' || formData.email.trim() === '' || formData.phone_number.trim() === '') {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await submitApplication({
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        course_id: course.id,
        course_title: course.title,
        message: formData.message,
        format: formData.format,
        session_type: formData.session_type,
        languages: formData.languages,
        free_practice: formData.free_practice
      });
      
      if (result) {
        setFormData({
          full_name: '',
          email: '',
          phone_number: '',
          message: '',
          format: '',
          session_type: '',
          languages: [],
          free_practice: true
        });

        handleClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => {
      const languages = prev.languages.includes(language)
        ? prev.languages.filter(lang => lang !== language)
        : [...prev.languages, language];
      return { ...prev, languages };
    });
  };

  const formatOptions = [
    { value: 'online', label: 'Առցանց (Օնլայն)' },
    { value: 'in_person', label: 'Առկա' },
    { value: 'hybrid', label: 'Հիբրիդային' }
  ];

  const sessionTypeOptions = [
    { value: 'individual', label: 'Անհատական' },
    { value: 'group', label: 'Խմբային' }
  ];

  const languages = [
    { id: 'armenian', label: 'Հայերեն' },
    { id: 'russian', label: 'Ռուսերեն' },
    { id: 'english', label: 'Անգլերեն' }
  ];

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Անուն Ազգանուն</Label>
        <div className="relative">
          <Input
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Ձեր անունը և ազգանունը"
            required
            className="pl-10"
          />
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Էլ. հասցե</Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ձեր էլ. հասցեն"
            required
            className="pl-10"
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_number">Հեռախոսահամար</Label>
        <div className="relative">
          <Input
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Ձեր հեռախոսահամարը"
            required
            className="pl-10"
          />
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="format">Ուսուցման ձևաչափ</Label>
        <Popover open={openFormat} onOpenChange={setOpenFormat}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openFormat}
              className="w-full justify-between"
            >
              {formData.format ? formatOptions.find(option => option.value === formData.format)?.label : "Ընտրեք ձևաչափը"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Որոնել ձևաչափ..." />
              <CommandEmpty>Ձևաչափ չի գտնվել.</CommandEmpty>
              <CommandGroup>
                {formatOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      setFormData(prev => ({ ...prev, format: currentValue }));
                      setOpenFormat(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        formData.format === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="session_type">Պարապմունքների տեսակ</Label>
        <Popover open={openSessionType} onOpenChange={setOpenSessionType}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openSessionType}
              className="w-full justify-between"
            >
              {formData.session_type ? sessionTypeOptions.find(option => option.value === formData.session_type)?.label : "Ընտրեք պարապմունքների տեսակը"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Որոնել տեսակ..." />
              <CommandEmpty>Տեսակ չի գտնվել.</CommandEmpty>
              <CommandGroup>
                {sessionTypeOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      setFormData(prev => ({ ...prev, session_type: currentValue }));
                      setOpenSessionType(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        formData.session_type === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Նախընտրելի լեզուներ</Label>
        <div className="grid grid-cols-2 gap-4">
          {languages.map((language) => (
            <div key={language.id} className="flex items-center space-x-2">
              <Checkbox 
                id={language.id} 
                checked={formData.languages.includes(language.id)} 
                onCheckedChange={() => handleLanguageToggle(language.id)}
              />
              <Label htmlFor={language.id} className="cursor-pointer">{language.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="free_practice" 
          checked={formData.free_practice} 
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, free_practice: !!checked }))}
        />
        <Label htmlFor="free_practice" className="cursor-pointer">+1 ամիս անվճար պրակտիկա</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Հաղորդագրություն (ոչ պարտադիր)</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Հավելյալ տեղեկություն կամ հարցեր"
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Ուղարկվում է...' : 'Ուղարկել հայտը'}
      </Button>
    </form>
  );

  if (onClose !== undefined) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <CardHeader>
            <CardTitle>Դիմում հայտ</CardTitle>
            <CardDescription>
              Լրացրեք ձևը և մենք կապ կհաստատենք ձեզ հետ
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formContent}
          </CardContent>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Դիմում հայտ</CardTitle>
        <CardDescription>
          Լրացրեք ձևը և մենք կապ կհաստատենք ձեզ հետ
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
};

export default CourseApplicationForm;
