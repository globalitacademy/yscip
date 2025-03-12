
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface EmailInputProps {
  value: string;
  error: string;
  onChange: (value: string) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ value, error, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="register-email">Էլ․ հասցե</Label>
      <Input
        id="register-email"
        type="email"
        placeholder="name@example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default EmailInput;
