
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CheckCircle } from 'lucide-react';

const CourseBenefitsCard: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="h-5 w-5 text-green-500" />
          <h3 className="font-semibold">Ինչու՞ ընտրել այս դասընթացը</h3>
        </div>
        
        <ul className="space-y-2 mb-6">
          <li className="flex items-start gap-2">
            <div className="shrink-0 mt-1 bg-green-100 rounded-full p-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
            </div>
            <span>Փորձառու դասավանդողներ</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="shrink-0 mt-1 bg-green-100 rounded-full p-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
            </div>
            <span>Գործնական հմտություններ</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="shrink-0 mt-1 bg-green-100 rounded-full p-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
            </div>
            <span>Խմբային աշխատանք</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="shrink-0 mt-1 bg-green-100 rounded-full p-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
            </div>
            <span>Ավարտական հավաստագիր</span>
          </li>
        </ul>
        
        <Button className="w-full" size="lg">
          Գրանցվել դասընթացին
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseBenefitsCard;
