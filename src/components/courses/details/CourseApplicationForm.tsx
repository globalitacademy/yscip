
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCourseApplications } from '@/hooks/useCourseApplications';

interface CourseApplicationFormProps {
  course: ProfessionalCourse;
  isOpen?: boolean;
  onClose?: () => void;
}

const CourseApplicationForm: React.FC<CourseApplicationFormProps> = ({ course, isOpen = true, onClose = () => {} }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { submitApplication } = useCourseApplications();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState('online');
  const [sessionType, setSessionType] = useState('group');
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>([]);
  const [acceptPractice, setAcceptPractice] = useState(true);
  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await submitApplication({
        full_name: name,
        email,
        phone_number: phone,
        course_id: course.id,
        course_title: course.title,
        message,
        format,
        session_type: sessionType,
        languages: preferredLanguages,
        free_practice: acceptPractice
      });

      if (success) {
        toast({
          title: 'Հայտն ուղարկված է',
          description: 'Ձեր դասընթացի հայտը հաջողությամբ ուղարկվել է։ Մենք կապ կհաստատենք Ձեզ հետ առաջիկա օրերին։',
        });
        onClose();
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Սխալ',
        description: 'Հայտը չհաջողվեց ուղարկել։ Խնդրում ենք փորձել կրկին։',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageToggle = (language: string) => {
    setPreferredLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(lang => lang !== language) 
        : [...prev, language]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Դիմել դասընթացին</DialogTitle>
          <DialogDescription>
            {course.title} դասընթացին գրանցվելու համար լրացրեք հետևյալ ձևաթուղթը։
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Անուն
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Էլ․ հասցե
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Հեռախոս
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="format" className="text-right">
                Ձևաչափ
              </Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Ընտրեք ձևաչափը" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Օնլայն</SelectItem>
                  <SelectItem value="offline">Առկա</SelectItem>
                  <SelectItem value="hybrid">Հիբրիդային</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sessionType" className="text-right">
                Դասի տեսակ
              </Label>
              <Select value={sessionType} onValueChange={setSessionType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Ընտրեք դասի տեսակը" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group">Խմբային</SelectItem>
                  <SelectItem value="individual">Անհատական</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Լեզուներ
              </Label>
              <div className="flex flex-col gap-3 col-span-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="armenian" 
                    checked={preferredLanguages.includes('armenian')}
                    onCheckedChange={() => handleLanguageToggle('armenian')}
                  />
                  <Label htmlFor="armenian">Հայերեն</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="russian" 
                    checked={preferredLanguages.includes('russian')}
                    onCheckedChange={() => handleLanguageToggle('russian')}
                  />
                  <Label htmlFor="russian">Ռուսերեն</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="english" 
                    checked={preferredLanguages.includes('english')}
                    onCheckedChange={() => handleLanguageToggle('english')}
                  />
                  <Label htmlFor="english">Անգլերեն</Label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Հաղորդագրություն
              </Label>
              <Textarea
                id="message"
                placeholder="Նշեք ցանկացած լրացուցիչ տեղեկություն..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="col-start-2 col-span-3 flex items-center space-x-2">
                <Checkbox 
                  id="acceptPractice" 
                  checked={acceptPractice}
                  onCheckedChange={(checked) => setAcceptPractice(checked as boolean)}
                />
                <Label htmlFor="acceptPractice" className="text-sm">
                  Ցանկանում եմ ստանալ +1 ամիս անվճար պրակտիկա
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Չեղարկել
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ուղարկել հայտ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseApplicationForm;
