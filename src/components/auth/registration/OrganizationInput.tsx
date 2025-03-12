
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface OrganizationInputProps {
  value: string;
  onChange: (value: string) => void;
  required: boolean;
}

const OrganizationInput: React.FC<OrganizationInputProps> = ({ value, onChange, required }) => {
  if (!required) return null;
  
  return (
    <div className="space-y-2">
      <Label htmlFor="organization">Կազմակերպության անունը</Label>
      <Input
        id="organization"
        type="text"
        placeholder="Կազմակերպության անունը"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
};

export default OrganizationInput;
