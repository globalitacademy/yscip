
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const CourseSyllabusTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ուսումնական պլան</CardTitle>
        <CardDescription>
          Դասընթացի մանրամասն ուսումնական պլանը
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border-l-4 border-primary pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Շաբաթ 1-2: Հիմունքներ</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
              <li>Ներածություն դասընթացին</li>
              <li>Ծրագրավորման հիմնական գործիքներ</li>
              <li>Առաջին ծրագրի ստեղծում</li>
              <li>Հիմնական հասկացություններ</li>
            </ul>
          </div>
          
          <div className="border-l-4 border-primary pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Շաբաթ 3-4: Հիմնական կոնցեպտներ</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
              <li>Տվյալների տիպեր և փոփոխականներ</li>
              <li>Օպերատորներ և արտահայտություններ</li>
              <li>Պայմանական կառուցվածքներ</li>
              <li>Ցիկլեր և կրկնվող գործողություններ</li>
            </ul>
          </div>
          
          <div className="border-l-4 border-primary pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Շաբաթ 5-6: Ֆունկցիաներ և ՕԿԾ</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
              <li>Ֆունկցիաների սահմանում և կանչ</li>
              <li>Պարամետրեր և վերադարձվող արժեքներ</li>
              <li>Օբյեկտային կողմնորոշված ծրագրավորում</li>
              <li>Դասեր և օբյեկտներ</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseSyllabusTab;
