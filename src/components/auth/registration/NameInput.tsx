
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
}

const NameInput: React.FC<NameInputProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Անուն Ազգանուն</Label>
      <Input
        id="name"
        type="text"
        placeholder="Անուն Ազգանուն"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
};

export default NameInput;
