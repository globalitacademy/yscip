
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const CourseRequirementsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Դասընթացի պահանջներ</CardTitle>
        <CardDescription>
          Ինչ է անհրաժեշտ դասընթացը սկսելու համար
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Տեխնիկական պահանջներ</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
              <li>Համակարգիչ (Windows, macOS կամ Linux)</li>
              <li>Ինտերնետ կապ</li>
              <li>Նվազագույնը 8GB RAM</li>
              <li>50GB ազատ տարածք</li>
            </ul>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Նախնական գիտելիքներ</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
              <li>Համակարգչային հիմնական հմտություններ</li>
              <li>Տրամաբանական մտածելակերպ</li>
              <li>Մաթեմատիկական հիմնական գիտելիքներ</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseRequirementsTab;
