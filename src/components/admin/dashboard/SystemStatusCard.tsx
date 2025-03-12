
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog } from 'lucide-react';

const SystemStatusCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <UserCog className="h-5 w-5 text-amber-500" />
          Համակարգի կարգավիճակ
        </CardTitle>
        <CardDescription>Համակարգի հիմնական ցուցանիշները</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span>Համակարգի բեռնվածություն</span>
          <span className="text-green-500 font-semibold">Նորմալ (32%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '32%' }}></div>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Վերջին պահուստավորում</span>
          <span className="text-gray-600">2 ժամ առաջ</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Պլանային թարմացում</span>
          <span className="text-amber-500">Այսօր 23:00</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Ակտիվ սեսիաներ</span>
          <span className="text-gray-600">145</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Միջին արձագանքի ժամանակ</span>
          <span className="text-green-500">210ms</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatusCard;
