
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUsersByRole } from '@/data/userRoles';

interface ReservationFormProps {
  selectedSupervisor: string;
  selectedInstructor: string;
  onSupervisorChange: (value: string) => void;
  onInstructorChange: (value: string) => void;
  onReserveProject: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  selectedSupervisor,
  selectedInstructor,
  onSupervisorChange,
  onInstructorChange,
  onReserveProject
}) => {
  // Get supervisors and instructors for selection
  const supervisors = getUsersByRole('supervisor').concat(getUsersByRole('project_manager'));
  const instructors = getUsersByRole('instructor').concat(getUsersByRole('lecturer'));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Պրոեկտի ամրագրում</CardTitle>
        <CardDescription>
          Ամրագրեք այս պրոեկտը և ընտրեք ձեր նախընտրած ղեկավարին կամ դասախոսին
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Ընտրեք ղեկավար</label>
          <Select value={selectedSupervisor} onValueChange={onSupervisorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Ընտրեք ղեկավար" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Ոչ մեկը</SelectItem>
              {supervisors.map(supervisor => (
                <SelectItem key={supervisor.id} value={supervisor.id}>
                  {supervisor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Ընտրեք դասախոս</label>
          <Select value={selectedInstructor} onValueChange={onInstructorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Ընտրեք դասախոս" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Ոչ մեկը</SelectItem>
              {instructors.map(instructor => (
                <SelectItem key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onReserveProject}>Ամրագրել պրոեկտը</Button>
      </CardFooter>
    </Card>
  );
};

export default ReservationForm;
