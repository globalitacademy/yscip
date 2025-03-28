
import React from 'react';
import { User, UserRole } from '@/types/user';
import { getCourses, getGroups } from '@/utils/userUtils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserFormData } from './types/formData';

interface UserFormFieldsProps {
  userData: Partial<UserFormData>;
  onUserDataChange: (userData: Partial<UserFormData>) => void;
  isEditMode?: boolean;
}

export const UserFormFields: React.FC<UserFormFieldsProps> = ({
  userData,
  onUserDataChange,
  isEditMode = false,
}) => {
  const showStudentFields = userData.role === 'student';
  const courseOptions = getCourses();
  const groupOptions = getGroups(userData.course);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUserDataChange({ ...userData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    onUserDataChange({ ...userData, [name]: value });
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Անուն Ազգանուն</Label>
        <Input
          id="name"
          name="name"
          value={userData.name || ''}
          onChange={handleChange}
          placeholder="Օրինակ՝ Վահե Պետրոսյան"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Էլ․ հասցե</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={userData.email || ''}
          onChange={handleChange}
          placeholder="email@example.com"
          disabled={isEditMode} // Email shouldn't be changed in edit mode
        />
        {isEditMode && (
          <p className="text-sm text-gray-500">Էլեկտրոնային հասցեն հնարավոր չէ փոփոխել</p>
        )}
      </div>
      {!isEditMode && (
        <div className="grid gap-2">
          <Label htmlFor="role">Դերակատարում</Label>
          <Select
            value={userData.role}
            onValueChange={(value) => handleSelectChange('role', value as UserRole)}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Ընտրեք դերակատարում" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Ադմինիստրատոր</SelectItem>
              <SelectItem value="supervisor">Ծրագրի ղեկավար</SelectItem>
              <SelectItem value="project_manager">Պրոեկտի մենեջեր</SelectItem>
              <SelectItem value="instructor">Դասախոս</SelectItem>
              <SelectItem value="lecturer">Դասախոս</SelectItem>
              <SelectItem value="student">Ուսանող</SelectItem>
              <SelectItem value="employer">Գործատու</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="grid gap-2">
        <Label htmlFor="department">Ֆակուլտետ</Label>
        <Input
          id="department"
          name="department"
          value={userData.department || ''}
          onChange={handleChange}
          placeholder="Օրինակ՝ Ինֆորմատիկայի ֆակուլտետ"
        />
      </div>
      
      {showStudentFields && (
        <>
          <div className="grid gap-2">
            <Label htmlFor="course">Կուրս</Label>
            <Select
              value={userData.course || ''}
              onValueChange={(value) => handleSelectChange('course', value)}
            >
              <SelectTrigger id="course">
                <SelectValue placeholder="Ընտրեք կուրսը" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1-ին կուրս</SelectItem>
                <SelectItem value="2">2-րդ կուրս</SelectItem>
                <SelectItem value="3">3-րդ կուրս</SelectItem>
                <SelectItem value="4">4-րդ կուրս</SelectItem>
                <SelectItem value="5">5-րդ կուրս</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="group">Խումբ</Label>
            <Input
              id="group"
              name="group"
              value={userData.group || ''}
              onChange={handleChange}
              placeholder="Օրինակ՝ ԿՄ-021"
            />
          </div>
        </>
      )}
    </div>
  );
};
