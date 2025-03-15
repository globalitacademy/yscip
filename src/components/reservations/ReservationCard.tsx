
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { ProjectReservation } from '@/types/project';

interface ReservationCardProps {
  reservation: ProjectReservation;
  onApprove: (reservationId: string) => void;
  onRejectOpen: (reservationId: string) => void;
  isAdmin: boolean;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onApprove,
  onRejectOpen,
  isAdmin
}) => {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{reservation.projectTitle}</h3>
          <p className="text-sm text-muted-foreground">
            Ամրագրված է: {new Date(reservation.timestamp).toLocaleDateString()} {new Date(reservation.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <Badge 
          variant={
            reservation.status === 'approved' ? 'default' : 
            reservation.status === 'rejected' ? 'destructive' : 
            'outline'
          }
        >
          {reservation.status === 'approved' ? (
            <span className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Հաստատված</span>
          ) : reservation.status === 'rejected' ? (
            <span className="flex items-center"><XCircle className="w-3 h-3 mr-1" /> Մերժված</span>
          ) : (
            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Սպասման մեջ</span>
          )}
        </Badge>
      </div>
      
      {reservation.feedback && (
        <div className="bg-muted p-2 rounded text-sm">
          <p className="font-medium">Մեկնաբանություն:</p>
          <p>{reservation.feedback}</p>
        </div>
      )}
      
      {isAdmin && reservation.status === 'pending' && (
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onApprove(reservation.id)}
          >
            Հաստատել
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onRejectOpen(reservation.id)}
          >
            Մերժել
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReservationCard;
