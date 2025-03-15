
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface EmptyReservationStateProps {
  title: string;
  description: string;
}

const EmptyReservationState: React.FC<EmptyReservationStateProps> = ({
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
        <div className="flex items-center justify-center p-6 text-muted-foreground">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 mb-2" />
            <p>{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyReservationState;
