
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, AlertCircle, RotateCw, Clock } from 'lucide-react';

// Sample data for recent activities
const recentActivities = [
  {
    id: 1,
    user: { name: 'Գարեգին Մ.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
    action: 'գրանցվել է',
    target: 'համակարգում',
    time: '10 րոպե առաջ',
    status: 'success'
  },
  {
    id: 2,
    user: { name: 'Անի Ս.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
    action: 'ավելացրել է նոր նախագիծ',
    target: 'Տվյալների վերլուծություն',
    time: '2 ժամ առաջ',
    status: 'success'
  },
  {
    id: 3,
    user: { name: 'Արման Հ.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
    action: 'սպասում է հաստատման',
    target: 'որպես Դասախոս',
    time: '4 ժամ առաջ',
    status: 'pending'
  },
  {
    id: 4,
    user: { name: 'Լիլիթ Ա.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
    action: 'թարմացրել է դասընթացը',
    target: 'Վեբ ծրագրավորում',
    time: '5 ժամ առաջ',
    status: 'info'
  },
  {
    id: 5,
    user: { name: 'Սուրեն Մ.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
    action: 'ուղարկել է հաղորդագրություն',
    target: 'աջակցության թիմին',
    time: '1 օր առաջ',
    status: 'warning'
  }
];

// Status icon component
const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'success':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'info':
      return <RotateCw className="h-4 w-4 text-sky-500" />;
    default:
      return null;
  }
};

const ActivityTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Վերջին գործողություններ</CardTitle>
        <CardDescription>Համակարգում կատարված վերջին գործողությունները</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-bold">{activity.user.name}</span> {activity.action}{' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
              <StatusIcon status={activity.status} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTab;
