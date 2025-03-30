
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CheckCircle, GraduationCap } from 'lucide-react';

const CourseBenefitsCard: React.FC = () => {
  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="bg-indigo-600 h-2 w-full"></div>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-indigo-100 p-2 rounded-full">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="font-bold text-lg">Ինչու՞ ընտրել այս դասընթացը</h3>
        </div>
        
        <ul className="space-y-4 mb-8">
          <li className="flex items-start gap-3">
            <div className="shrink-0 mt-1 bg-green-100 rounded-full p-1.5">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-gray-700">Փորձառու դասավանդողներ</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="shrink-0 mt-1 bg-green-100 rounded-full p-1.5">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-gray-700">Գործնական հմտություններ</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="shrink-0 mt-1 bg-green-100 rounded-full p-1.5">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-gray-700">Խմբային աշխատանք</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="shrink-0 mt-1 bg-green-100 rounded-full p-1.5">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-gray-700">Ավարտական հավաստագիր</span>
          </li>
        </ul>
        
        <Button className="w-full rounded-full shadow-md bg-indigo-600 hover:bg-indigo-700 transition-all" size="lg">
          Գրանցվել դասընթացին
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseBenefitsCard;
