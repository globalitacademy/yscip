
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotificationsTab: React.FC = () => {
  // Notifications mock data
  const notifications = [
    { id: 1, title: 'Նոր գրանցման դիմում', message: '3 նոր գրանցման դիմում սպասում է հաստատման', time: '15 րոպե առաջ', type: 'warning' },
    { id: 2, title: 'Համակարգի թարմացում', message: 'Պլանային թարմացում է նախատեսված այսօր 23:00-ին', time: '1 ժամ առաջ', type: 'info' },
    { id: 3, title: 'Ուշադրություն', message: '5 ուսանողներ սպասում են նախագծի հաստատման', time: '3 ժամ առաջ', type: 'alert' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Bell className="h-5 w-5 text-amber-500" />
          Համակարգային ծանուցումներ
        </CardTitle>
        <CardDescription>Կարևոր ծանուցումներ համակարգի մասին</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-4 border rounded-lg ${
                notification.type === 'warning' ? 'border-amber-200 bg-amber-50' : 
                notification.type === 'alert' ? 'border-red-200 bg-red-50' : 
                'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{notification.title}</h4>
                  <p className="text-sm mt-1">{notification.message}</p>
                </div>
                <span className="text-xs text-gray-500">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline">Դիտել բոլոր ծանուցումները</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
