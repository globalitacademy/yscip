
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CourseModulesTabProps {
  modules: string[];
}

const CourseModulesTab: React.FC<CourseModulesTabProps> = ({ modules }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Դասընթացի մոդուլներ</CardTitle>
        <CardDescription>
          Դասընթացը բաղկացած է հետևյալ մոդուլներից՝
        </CardDescription>
      </CardHeader>
      <CardContent>
        {modules && modules.length > 0 ? (
          <div className="space-y-4">
            {modules.map((module, index) => (
              <div key={index} className="border p-4 rounded-lg bg-muted/30">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <h4 className="font-medium">{module}</h4>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {index < 2 ? 'Ավարտված' : index < 4 ? 'Ընթացքի մեջ' : 'Չսկսված'}
                  </Badge>
                </div>
                <Progress value={index < 2 ? 100 : index < 4 ? 50 : 0} className="h-1 mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Մոդուլների ցանկը դեռ հասանելի չէ</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseModulesTab;
