
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, Clock, BookOpen, Bell, BriefcaseMedical } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { notificationService } from '@/services/notificationService';
import { useAuth } from '@/contexts/AuthContext';

const StatCards: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user?.id) {
        const notifications = await notificationService.getUserNotifications(user.id);
        const unread = notifications.filter(n => !n.read).length;
        setUnreadNotifications(unread);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleMarkAllAsRead = async () => {
    if (user?.id) {
      const success = await notificationService.markAllAsRead(user.id);
      if (success) {
        setUnreadNotifications(0);
      }
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 my-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 card-hover overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-md font-medium">Ծանուցումներ</CardTitle>
            <Bell className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{unreadNotifications}</div>
              <p className="text-xs text-muted-foreground">
                Չկարդացված ծանուցումներ
              </p>
              {unreadNotifications > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Նշել բոլորը որպես կարդացված
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 card-hover overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-md font-medium">Օգտատերեր</CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{isMobile ? "152+" : "152"}</div>
              <p className="text-xs text-muted-foreground">
                Ակտիվ օգտատերեր
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 card-hover overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-md font-medium">Դասընթացներ</CardTitle>
            <BookOpen className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{isMobile ? "24+" : "24"}</div>
              <p className="text-xs text-muted-foreground">
                Ակտիվ դասընթացներ
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 card-hover overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-md font-medium">Նախագծեր</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{isMobile ? "38+" : "38"}</div>
              <p className="text-xs text-muted-foreground">
                Ակտիվ նախագծեր
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 card-hover overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-md font-medium">Առողջապահություն</CardTitle>
            <BriefcaseMedical className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground">
                Համակարգի առողջություն
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 card-hover overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-md font-medium">Ակտիվ սեսիա</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">Տարի 2024</div>
              <p className="text-xs text-muted-foreground">
                Ընթացիկ ուսումնական տարի
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatCards;
