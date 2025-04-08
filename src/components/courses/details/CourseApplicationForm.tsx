
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import ApplicationFormHeader from './form/ApplicationFormHeader';
import PersonalInfoFields from './form/PersonalInfoFields';
import CoursePreferenceFields from './form/CoursePreferenceFields';
import ApplicationFormFooter from './form/ApplicationFormFooter';
import { useApplicationForm } from './hooks/useApplicationForm';
import { useTheme } from '@/hooks/use-theme';

interface CourseApplicationFormProps {
  course: ProfessionalCourse;
  isOpen?: boolean;
  onClose?: () => void;
}

const CourseApplicationForm: React.FC<CourseApplicationFormProps> = ({ 
  course, 
  isOpen = true, 
  onClose = () => {} 
}) => {
  const {
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
  } = useApplicationForm(course, onClose);

  const { theme } = useTheme();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[500px] ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-gray-100' : ''}`}>
        <ApplicationFormHeader course={course} />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <PersonalInfoFields 
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
            />
            
            <CoursePreferenceFields 
              format={format}
              setFormat={setFormat}
              sessionType={sessionType}
              setSessionType={setSessionType}
              preferredLanguages={preferredLanguages}
              handleLanguageToggle={handleLanguageToggle}
              message={message}
              setMessage={setMessage}
              acceptPractice={acceptPractice}
              setAcceptPractice={setAcceptPractice}
            />
          </div>
          
          <ApplicationFormFooter 
            loading={loading} 
            onClose={onClose} 
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseApplicationForm;
