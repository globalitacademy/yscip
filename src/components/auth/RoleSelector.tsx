
import React from 'react';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/data/userRoles';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoleSelectorProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ role, onRoleChange }) => {
  const getRoleDescription = (selectedRole: UserRole) => {
    switch (selectedRole) {
      case 'admin':
        return 'Կառավարել օգտատերերին, նախագծերը և համակարգը';
      case 'lecturer':
        return 'Ստեղծել առաջադրանքներ, գնահատել ուսանողներին';
      case 'project_manager':
        return 'Կառավարել նախագծերը, հետևել առաջընթացին';
      case 'employer':
        return 'Հայտարարել նոր նախագծեր, համագործակցել ուսանողների հետ';
      case 'student':
        return 'Ընտրել և կատարել նախագծեր, զարգացնել հմտություններ';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="role">Դերակատարում</Label>
      <Select value={role} onValueChange={(value) => onRoleChange(value as UserRole)}>
        <SelectTrigger id="role">
          <SelectValue placeholder="Ընտրեք դերը" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="student">Ուսանող</SelectItem>
          <SelectItem value="lecturer">Դասախոս</SelectItem>
          <SelectItem value="project_manager">Նախագծի ղեկավար</SelectItem>
          <SelectItem value="employer">Գործատու</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground mt-1">
        {getRoleDescription(role)}
      </p>
    </div>
  );
};

export default RoleSelector;
