
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCircle, Mail, AlertTriangle, MessageSquare, Info } from 'lucide-react';

// Mock data for notifications
const notifications = [
  {
    id: 1,
    title: 'Նոր դիմում',
    message: 'Նոր դիմում Մարիամ Հակոբյանից «Վեբ ծրագրավորում» դասընթացին',
    type: 'application',
    read: false,
    created_at: '2023-06-01T10:15:00Z'
  },
  {
    id: 2,
    title: 'Համակարգի թարմացում',
    message: 'Համակարգի նոր տարբերակը հասանելի է։ Սեղմեք՝ թարմացնելու համար։',
    type: 'system',
    read: true,
    created_at: '2023-05-30T14:22:00Z'
  },
  {
    id: 3,
    title: 'Նոր հաղորդագրություն',
    message: 'Նոր հաղորդագրություն Արամ Պետրոսյանից',
    type: 'message',
    read: false,
    created_at: '2023-05-29T09:11:00Z'
  },
  {
    id: 4,
    title: 'Կարևոր ծանուցում',
    message: 'Սերվերի պլանային տեխնիկական սպասարկումը նախատեսված է հունիսի 5֊ին, ժամը 22:00-ից',
    type: 'important',
    read: false,
    created_at: '2023-05-28T16:45:00Z'
  },
  {
    id: 5,
    title: 'Նոր օգտատեր',
    message: 'Կարեն Մկրտչյանը գրանցվել է համակարգում',
    type: 'user',
    read: true,
    created_at: '2023-05-28T11:30:00Z'
  }
];

// Function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('hy-AM', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Get icon based on notification type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'application':
      return <CheckCircle className="h-5 w-5 text-blue-500" />;
    case 'system':
      return <Bell className="h-5 w-5 text-purple-500" />;
    case 'message':
      return <MessageSquare className="h-5 w-5 text-green-500" />;
    case 'important':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'user':
      return <Info className="h-5 w-5 text-blue-500" />;
    default:
      return <Mail className="h-5 w-5 text-gray-500" />;
  }
};

// Get badge for notification type
const getNotificationBadge = (type: string) => {
  switch (type) {
    case 'application':
      return <Badge className="bg-blue-500">Դիմում</Badge>;
    case 'system':
      return <Badge className="bg-purple-500">Համակարգային</Badge>;
    case 'message':
      return <Badge className="bg-green-500">Հաղորդագրություն</Badge>;
    case 'important':
      return <Badge className="bg-amber-500">Կարևոր</Badge>;
    case 'user':
      return <Badge className="bg-blue-500">Օգտատեր</Badge>;
    default:
      return <Badge>Այլ</Badge>;
  }
};

const NotificationsPage: React.FC = () => {
  const [activeNotifications, setActiveNotifications] = useState(notifications);

  const markAsRead = (id: number) => {
    setActiveNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setActiveNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setActiveNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const unreadCount = activeNotifications.filter(n => !n.read).length;

  return (
    <AdminLayout pageTitle="Ծանուցումներ">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Ծանուցումներ</h2>
          <p className="text-muted-foreground">
            {unreadCount > 0 
              ? `Դուք ունեք ${unreadCount} չկարդացված ծանուցում` 
              : 'Բոլոր ծանուցումները կարդացված են'}
          </p>
        </div>
        <Button onClick={markAllAsRead} variant="outline">
          Նշել բոլորը որպես կարդացված
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Բոլորը</TabsTrigger>
          <TabsTrigger value="unread">Չկարդացված</TabsTrigger>
          <TabsTrigger value="system">Համակարգային</TabsTrigger>
          <TabsTrigger value="messages">Հաղորդագրություններ</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Բոլոր ծանուցումները</CardTitle>
              <CardDescription>Ձեր բոլոր ծանուցումները</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Վերնագիր</TableHead>
                    <TableHead>Հաղորդագրություն</TableHead>
                    <TableHead>Տեսակ</TableHead>
                    <TableHead>Ամսաթիվ</TableHead>
                    <TableHead className="text-right">Գործողություններ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeNotifications.map((notification) => (
                    <TableRow key={notification.id} className={notification.read ? '' : 'bg-muted'}>
                      <TableCell>
                        {getNotificationIcon(notification.type)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </TableCell>
                      <TableCell>{notification.message}</TableCell>
                      <TableCell>{getNotificationBadge(notification.type)}</TableCell>
                      <TableCell>{formatDate(notification.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => markAsRead(notification.id)}
                            >
                              Նշել որպես կարդացված
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            Ջնջել
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread">
          <Card>
            <CardHeader>
              <CardTitle>Չկարդացված ծանուցումները</CardTitle>
              <CardDescription>Ձեր չկարդացված ծանուցումները</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Վերնագիր</TableHead>
                    <TableHead>Հաղորդագրություն</TableHead>
                    <TableHead>Տեսակ</TableHead>
                    <TableHead>Ամսաթիվ</TableHead>
                    <TableHead className="text-right">Գործողություններ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeNotifications.filter(n => !n.read).map((notification) => (
                    <TableRow key={notification.id} className="bg-muted">
                      <TableCell>
                        {getNotificationIcon(notification.type)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {notification.title}
                        <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                      </TableCell>
                      <TableCell>{notification.message}</TableCell>
                      <TableCell>{getNotificationBadge(notification.type)}</TableCell>
                      <TableCell>{formatDate(notification.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markAsRead(notification.id)}
                          >
                            Նշել որպես կարդացված
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            Ջնջել
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>Համակարգային ծանուցումները</CardTitle>
              <CardDescription>Համակարգի վերաբերյալ ծանուցումներ</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Վերնագիր</TableHead>
                    <TableHead>Հաղորդագրություն</TableHead>
                    <TableHead>Ամսաթիվ</TableHead>
                    <TableHead className="text-right">Գործողություններ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeNotifications.filter(n => n.type === 'system' || n.type === 'important').map((notification) => (
                    <TableRow key={notification.id} className={notification.read ? '' : 'bg-muted'}>
                      <TableCell>
                        {getNotificationIcon(notification.type)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </TableCell>
                      <TableCell>{notification.message}</TableCell>
                      <TableCell>{formatDate(notification.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => markAsRead(notification.id)}
                            >
                              Նշել որպես կարդացված
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            Ջնջել
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Հաղորդագրություններ</CardTitle>
              <CardDescription>Անձնական հաղորդագրություններ</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Վերնագիր</TableHead>
                    <TableHead>Հաղորդագրություն</TableHead>
                    <TableHead>Ամսաթիվ</TableHead>
                    <TableHead className="text-right">Գործողություններ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeNotifications.filter(n => n.type === 'message').map((notification) => (
                    <TableRow key={notification.id} className={notification.read ? '' : 'bg-muted'}>
                      <TableCell>
                        {getNotificationIcon(notification.type)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </TableCell>
                      <TableCell>{notification.message}</TableCell>
                      <TableCell>{formatDate(notification.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => markAsRead(notification.id)}
                            >
                              Նշել որպես կարդացված
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            Ջնջել
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default NotificationsPage;
