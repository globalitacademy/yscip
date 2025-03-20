
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const CourseProgramTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ուսումնական ծրագիր</CardTitle>
        <CardDescription>
          Դասընթացի մանրամասն ուսումնական պլանը
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border p-4 rounded-lg">
            <h4 className="font-medium mb-2">1. Ներածություն</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
              <li>Ծանոթություն դասընթացի հետ</li>
              <li>Հիմնական գործիքների տեղադրում և կարգավորում</li>
              <li>Առաջին ծրագրի ստեղծում</li>
            </ul>
          </div>
          
          <div className="border p-4 rounded-lg">
            <h4 className="font-medium mb-2">2. Հիմնական հասկացություններ</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
              <li>Տվյալների տիպեր և փոփոխականներ</li>
              <li>Օպերատորներ և արտահայտություններ</li>
              <li>Պայմանական կառուցվածքներ</li>
              <li>Ցիկլեր և կրկնվող գործողություններ</li>
            </ul>
          </div>
          
          <div className="border p-4 rounded-lg">
            <h4 className="font-medium mb-2">3. Ֆունկցիաներ և մեթոդներ</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
              <li>Ֆունկցիաների սահմանում և կանչ</li>
              <li>Պարամետրեր և վերադարձվող արժեքներ</li>
              <li>Ռեկուրսիա</li>
              <li>Լամբդա ֆունկցիաներ</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseProgramTab;
