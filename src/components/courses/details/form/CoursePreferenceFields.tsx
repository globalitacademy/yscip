
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTheme } from '@/hooks/use-theme';

interface CoursePreferenceFieldsProps {
  format: string;
  setFormat: (value: string) => void;
  sessionType: string;
  setSessionType: (value: string) => void;
  preferredLanguages: string[];
  handleLanguageToggle: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  acceptPractice: boolean;
  setAcceptPractice: (value: boolean) => void;
}

const CoursePreferenceFields: React.FC<CoursePreferenceFieldsProps> = ({ 
  format, setFormat, 
  sessionType, setSessionType, 
  preferredLanguages, handleLanguageToggle,
  message, setMessage,
  acceptPractice, setAcceptPractice 
}) => {
  const { theme } = useTheme();
  
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <div className="text-right">
          <Label className={theme === 'dark' ? 'text-gray-300' : ''}>Ձևաչափ</Label>
        </div>
        <div className="col-span-3">
          <RadioGroup value={format} onValueChange={setFormat} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" className={theme === 'dark' ? 'border-gray-600' : ''} />
              <Label htmlFor="individual" className={theme === 'dark' ? 'text-gray-300' : ''}>Անհատական</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="group" id="group" className={theme === 'dark' ? 'border-gray-600' : ''} />
              <Label htmlFor="group" className={theme === 'dark' ? 'text-gray-300' : ''}>Խմբային</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <div className="text-right">
          <Label className={theme === 'dark' ? 'text-gray-300' : ''}>Տարբերակ</Label>
        </div>
        <div className="col-span-3">
          <RadioGroup value={sessionType} onValueChange={setSessionType} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="online" id="online" className={theme === 'dark' ? 'border-gray-600' : ''} />
              <Label htmlFor="online" className={theme === 'dark' ? 'text-gray-300' : ''}>Առցանց</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="offline" id="offline" className={theme === 'dark' ? 'border-gray-600' : ''} />
              <Label htmlFor="offline" className={theme === 'dark' ? 'text-gray-300' : ''}>Դասընթացի վայրում</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hybrid" id="hybrid" className={theme === 'dark' ? 'border-gray-600' : ''} />
              <Label htmlFor="hybrid" className={theme === 'dark' ? 'text-gray-300' : ''}>Հիբրիդային</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <div className="text-right">
          <Label className={theme === 'dark' ? 'text-gray-300' : ''}>Նախընտրելի լեզուներ</Label>
        </div>
        <div className="col-span-3">
          <ToggleGroup type="multiple" className="flex flex-wrap gap-2">
            {['Հայերեն', 'Ռուսերեն', 'Անգլերեն'].map((lang) => (
              <ToggleGroupItem
                key={lang}
                value={lang}
                aria-label={lang}
                className={`px-3 py-1 text-xs ${theme === 'dark' 
                  ? 'data-[state=on]:bg-indigo-700 data-[state=on]:text-white' 
                  : 'data-[state=on]:bg-indigo-600 data-[state=on]:text-white'} 
                  rounded-full`}
                data-state={preferredLanguages.includes(lang) ? 'on' : 'off'}
                onClick={() => handleLanguageToggle(lang)}
              >
                {lang}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="message" className={`text-right ${theme === 'dark' ? 'text-gray-300' : ''}`}>
          Հաղորդագրություն
        </Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Հավելյալ տեղեկատվություն..."
          className={`col-span-3 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <div className="col-start-2 col-span-3">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="practice" 
              checked={acceptPractice} 
              onCheckedChange={(checked) => setAcceptPractice(checked as boolean)}
              className={theme === 'dark' ? 'border-gray-600' : ''}
            />
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor="practice" 
                className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-300' : ''}`}
              >
                Ցանկանում եմ պրակտիկ պարապմունքներ անցնել
              </Label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursePreferenceFields;
