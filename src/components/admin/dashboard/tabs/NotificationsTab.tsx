
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, MessageSquare, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data for notifications
const notifications = [
  {
    id: 1,
    type: 'warning',
    title: 'Համակարգային ծանուցում',
    message: 'Թարմացրեք համակարգի անվտանգության կարգավորումները',
    time: '1 ժամ առաջ',
    unread: true
  },
  {
    id: 2,
    type: 'info',
    title: 'Նոր օգտատեր',
    message: 'Կարեն Մկրտչյանը գրանցվել է համակարգում',
    time: '3 ժամ առաջ',
    unread: true
  },
  {
    id: 3,
    type: 'success',
    title: 'Համակարգի թարմացում',
    message: 'Համակարգի թարմացումը հաջողությամբ ավարտվել է',
    time: '1 օր առաջ',
    unread: false
  },
  {
    id: 4,
    type: 'message',
    title: 'Նոր հաղորդագրություն',
    message: 'Դուք ունեք նոր հաղորդագրություն Արամ Պետրոսյանից',
    time: '2 օր առաջ',
    unread: false
  },
  {
    id: 5,
    type: 'warning',
    title: 'Սերվերի թարմացում',
    message: 'Պլանավորված սերվերի թարմացում այսօր 22:00-ին',
    time: '3 օր առաջ',
    unread: false
  }
];

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
    case 'success':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'message':
      return <MessageSquare className="h-5 w-5 text-purple-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const NotificationsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Ծանուցումներ</CardTitle>
          <CardDescription>Համակարգային ծանուցումներ</CardDescription>
        </div>
        <Button variant="outline" size="sm">Նշել բոլորը որպես կարդացված</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`flex p-3 rounded-lg ${notification.unread ? 'bg-muted' : ''}`}
            >
              <div className="mr-3">
                <NotificationIcon type={notification.type} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-semibold">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
                <p className="text-sm mt-1">{notification.message}</p>
              </div>
              {notification.unread && (
                <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full self-start mt-2"></div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
