
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCourseApplications } from '@/hooks/useCourseApplications';
import { ProfessionalCourse } from '../../types/ProfessionalCourse';

export const useApplicationForm = (
  course: ProfessionalCourse,
  onSuccess: () => void
) => {
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

  const handleLanguageToggle = (language: string) => {
    setPreferredLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(lang => lang !== language) 
        : [...prev, language]
    );
  };

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
        onSuccess();
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

  return {
    name, setName,
    email, setEmail,
    phone, setPhone,
    message, setMessage,
    loading,
    format, setFormat,
    sessionType, setSessionType,
    preferredLanguages,
    acceptPractice, setAcceptPractice,
    handleLanguageToggle,
    handleSubmit
  };
};
