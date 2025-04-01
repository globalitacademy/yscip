
import React from 'react';
import { Bell, User, Calendar } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Example notification data
const notifications = [
  {
    id: 1,
    title: 'Նոր օգտատեր',
    message: 'Արմեն Գրիգորյանը գրանցվել է համակարգում',
    type: 'user',
    date: '2023-04-01T10:30:00',
    read: false
  },
  {
    id: 2,
    title: 'Դասընթացի դիմում',
    message: 'Կարինե Պողոսյանը դիմել է "React հիմունքներ" դասընթացին',
    type: 'course',
    date: '2023-04-01T09:15:00',
    read: true
  },
  {
    id: 3,
    title: 'Նախագծի հաստատում',
    message: 'Նախագիծ "Էլեկտրոնային խանութ" հաստատվել է',
    type: 'project',
    date: '2023-03-31T16:45:00',
    read: false
  }
];

const NotificationsPage: React.FC = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('hy-AM', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'user':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'course':
        return <Calendar className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <AdminLayout pageTitle="Ծանուցումներ">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Վերջին ծանուցումներ
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`flex items-start p-4 rounded-md ${
                    notification.read ? 'bg-muted/50' : 'bg-muted/80 border-l-4 border-primary'
                  }`}
                >
                  <div className="flex-shrink-0 mr-4">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{notification.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(notification.date)}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Bell className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Դուք չունեք ծանուցումներ</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default NotificationsPage;
