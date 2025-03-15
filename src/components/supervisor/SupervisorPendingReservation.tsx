
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { ProjectReservation } from '@/types/project';
import { User } from '@/types/user';

interface SupervisorPendingReservationProps {
  reservation: ProjectReservation;
  student: User | undefined;
  onApprove: (reservation: ProjectReservation) => void;
  onReject: (reservation: ProjectReservation) => void;
}

const SupervisorPendingReservation: React.FC<SupervisorPendingReservationProps> = ({
  reservation,
  student,
  onApprove,
  onReject
}) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{reservation.projectTitle}</CardTitle>
            <CardDescription>
              Հարցում ուղարկվել է {new Date(reservation.timestamp).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-700 border-amber-200"
          >
            <Clock className="h-3 w-3 mr-1" /> Սպասում է
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={student?.avatar} alt={student?.name} />
            <AvatarFallback>{student?.name?.substring(0, 2) || 'ՈՒ'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{student?.name || 'Անհայտ ուսանող'}</p>
            <p className="text-sm text-muted-foreground">{student?.group || 'Անհայտ խումբ'}</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => onReject(reservation)}
          >
            <XCircle className="h-4 w-4 mr-1" /> Մերժել
          </Button>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onApprove(reservation)}
          >
            <CheckCircle className="h-4 w-4 mr-1" /> Հաստատել
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupervisorPendingReservation;
