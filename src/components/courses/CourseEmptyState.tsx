
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const CourseEmptyState: React.FC = () => {
  return (
    <Card className="bg-muted">
      <CardContent className="pt-6 text-center">
        <p className="text-muted-foreground">Դասընթացներ չեն գտնվել</p>
      </CardContent>
    </Card>
  );
};

export default CourseEmptyState;
