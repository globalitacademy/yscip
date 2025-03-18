
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Group } from './types';

interface GroupCardProps {
  group: Group;
  isAdmin: boolean;
  getLecturerName: (id: string) => string;
  getStudentCount: (groupId: string) => number;
  onViewGroup: (group: Group) => void;
  onDeleteGroup: (id: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  isAdmin,
  getLecturerName,
  getStudentCount,
  onViewGroup,
  onDeleteGroup
}) => {
  return (
    <Card key={group.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-xl">{group.name}</CardTitle>
          {isAdmin && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-destructive" 
              onClick={() => onDeleteGroup(group.id)}
            >
              ✕
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Կուրս:</span>
            <span>{group.course}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Դասախոս:</span>
            <span>{getLecturerName(group.lecturer_id)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Ուսանողներ:</span>
            <span>{getStudentCount(group.id)}</span>
          </div>
          <div className="pt-2">
            <Button size="sm" className="w-full" onClick={() => onViewGroup(group)}>
              Դիտել խումբը
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
