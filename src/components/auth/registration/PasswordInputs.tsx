
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PasswordInputsProps {
  password: string;
  confirmPassword: string;
  passwordError: string;
  confirmPasswordError: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
}

const PasswordInputs: React.FC<PasswordInputsProps> = ({
  password,
  confirmPassword,
  passwordError,
  confirmPasswordError,
  onPasswordChange,
  onConfirmPasswordChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="register-password">Գաղտնաբառ</Label>
        <Input
          id="register-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          className={passwordError ? "border-red-500" : ""}
        />
        {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Հաստատել գաղտնաբառը</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          required
          className={confirmPasswordError ? "border-red-500" : ""}
        />
        {confirmPasswordError && <p className="text-sm text-red-500 mt-1">{confirmPasswordError}</p>}
      </div>
    </>
  );
};

export default PasswordInputs;
