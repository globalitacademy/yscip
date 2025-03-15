
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface SupervisorEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SupervisorEmptyState: React.FC<SupervisorEmptyStateProps> = ({
  icon,
  title,
  description
}) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-muted-foreground mb-4 opacity-50">{icon}</div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default SupervisorEmptyState;
