
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface CoursePreferenceFieldsProps {
  format: string;
  setFormat: (value: string) => void;
  sessionType: string;
  setSessionType: (value: string) => void;
  preferredLanguages: string[];
  handleLanguageToggle: (language: string) => void;
  message: string;
  setMessage: (value: string) => void;
  acceptPractice: boolean;
  setAcceptPractice: (value: boolean) => void;
}

const CoursePreferenceFields: React.FC<CoursePreferenceFieldsProps> = ({
  format,
  setFormat,
  sessionType,
  setSessionType,
  preferredLanguages,
  handleLanguageToggle,
  message,
  setMessage,
  acceptPractice,
  setAcceptPractice
}) => {
  return (
    <>
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
    </>
  );
};

export default CoursePreferenceFields;
