
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ProjectReservation } from '@/types/project';
import ReservationCard from './ReservationCard';

interface ReservationListProps {
  reservations: ProjectReservation[];
  onApprove: (reservationId: string) => void;
  onRejectOpen: (reservationId: string) => void;
  isAdmin: boolean;
  title: string;
  description: string;
}

const ReservationList: React.FC<ReservationListProps> = ({
  reservations,
  onApprove,
  onRejectOpen,
  isAdmin,
  title,
  description
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reservations.map((reservation, index) => (
            <ReservationCard
              key={index}
              reservation={reservation}
              onApprove={onApprove}
              onRejectOpen={onRejectOpen}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationList;
