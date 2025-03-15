
import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AccessDenied: React.FC = () => {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Նախագծի տեղադրում</CardTitle>
        <CardDescription>
          Այս բաժինը հասանելի է միայն ուսանողների համար
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <Info size={48} className="text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">
          Ձեր դերակատարումը չունի նախագծեր ներկայացնելու թույլտվություն։
        </p>
        <p className="text-sm text-muted-foreground">
          Կապվեք ձեր ղեկավարի հետ հետագա քայլերի համար։
        </p>
      </CardContent>
    </Card>
  );
};

export default AccessDenied;
