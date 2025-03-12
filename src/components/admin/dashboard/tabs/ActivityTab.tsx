
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ActivityTab: React.FC = () => {
  // Recent activity mock data
  const recentActivity = [
    { id: 1, user: 'Արման Գրիգորյան', action: 'գրանցվել է որպես ուսանող', time: '10 րոպե առաջ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arman' },
    { id: 2, user: 'Նարե Հարությունյան', action: 'ավելացրել է նոր նախագիծ', time: '32 րոպե առաջ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nare' },
    { id: 3, user: 'Վահե Սարգսյան', action: 'թարմացրել է իր պրոֆիլը', time: '1 ժամ առաջ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vahe' },
    { id: 4, user: 'Անի Մկրտչյան', action: 'միացել է «ՎԵԲ ծրագրավորում» կուրսին', time: '3 ժամ առաջ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ani' },
    { id: 5, user: 'Համլետ Պողոսյան', action: 'հաստատել է ուսանողի նախագիծը', time: '5 ժամ առաջ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hamlet' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Activity className="h-5 w-5 text-blue-500" />
          Վերջին գործողություններ
        </CardTitle>
        <CardDescription>Օգտատերերի վերջին գործողությունները համակարգում</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentActivity.map(activity => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={activity.avatar} alt={activity.user} />
                <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline">Դիտել բոլոր գործողությունները</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTab;
