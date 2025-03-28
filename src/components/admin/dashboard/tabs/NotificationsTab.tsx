
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Bell, Info } from 'lucide-react';

// Sample notifications data
const notifications = [
  {
    id: 1,
    title: 'Նոր գրանցման հաստատում',
    message: 'Կարեն Մ․-ն սպասում է հաստատման որպես դասախոս։',
    time: '10 րոպե առաջ',
    type: 'approval',
    read: false
  },
  {
    id: 2,
    title: 'Նոր նախագծի առաջարկ',
    message: 'Սինոփսիս ՓԲԸ-ն առաջարկել է նոր նախագիծ ուսանողների համար։',
    time: '1 ժամ առաջ',
    type: 'project',
    read: false
  },
  {
    id: 3,
    title: 'Համակարգի թարմացում',
    message: 'Համակարգը հաջողությամբ թարմացվել է 2.3.0 տարբերակին։',
    time: '3 ժամ առաջ',
    type: 'system',
    read: true
  },
  {
    id: 4,
    title: 'Ահազանգ',
    message: 'Մի քանի օգտատեր զեկուցել է անպատշաճ բովանդակություն պարունակող նախագծի մասին։',
    time: '1 օր առաջ',
    type: 'alert',
    read: false
  },
  {
    id: 5,
    title: 'Աջակցություն',
    message: 'Ստացվել է 3 նոր աջակցության հարցում օգտատերերից։',
    time: '2 օր առաջ',
    type: 'support',
    read: true
  }
];

// Notification icon by type
const NotificationIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'approval':
      return <Check className="h-4 w-4 text-green-500" />;
    case 'alert':
      return <X className="h-4 w-4 text-red-500" />;
    case 'system':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'support':
      return <Info className="h-4 w-4 text-amber-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const NotificationsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Ծանուցումներ</CardTitle>
          <CardDescription>Ձեր վերջին ծանուցումները</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Նշել բոլորը որպես կարդացված
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-4 rounded-lg border p-4 ${
                notification.read ? 'bg-background opacity-70' : 'bg-muted/50'
              }`}
            >
              <div className="mt-0.5">
                <NotificationIcon type={notification.type} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
              {!notification.read && (
                <div className="flex shrink-0 items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
