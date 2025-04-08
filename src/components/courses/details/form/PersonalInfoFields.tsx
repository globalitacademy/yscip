
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/use-theme';

interface PersonalInfoFieldsProps {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ 
  name, setName, email, setEmail, phone, setPhone 
}) => {
  const { theme } = useTheme();
  
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className={`text-right ${theme === 'dark' ? 'text-gray-300' : ''}`}>
          Անուն
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`col-span-3 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className={`text-right ${theme === 'dark' ? 'text-gray-300' : ''}`}>
          Էլ․ հասցե
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`col-span-3 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className={`text-right ${theme === 'dark' ? 'text-gray-300' : ''}`}>
          Հեռախոս
        </Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={`col-span-3 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}
          required
        />
      </div>
    </>
  );
};

export default PersonalInfoFields;
