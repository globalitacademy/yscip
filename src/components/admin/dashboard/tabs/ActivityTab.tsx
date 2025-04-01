
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data for activity feed
const activities = [
  {
    id: 1,
    user: { name: 'Արամ Պետրոսյան', role: 'lecturer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor' },
    action: 'ստեղծել է նոր դասընթաց',
    target: 'Վեբ ծրագրավորում',
    time: '2 ժամ առաջ'
  },
  {
    id: 2,
    user: { name: 'Գևորգ Սարգսյան', role: 'student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2' },
    action: 'միացել է դասընթացին',
    target: 'Մեքենայական ուսուցում',
    time: '3 ժամ առաջ'
  },
  {
    id: 3,
    user: { name: 'Մարիամ Ավետիսյան', role: 'supervisor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supervisor' },
    action: 'հաստատել է նախագիծը',
    target: 'Արհեստական բանականություն կիրառումներ',
    time: '5 ժամ առաջ'
  },
  {
    id: 4,
    user: { name: 'Աննա Հարությունյան', role: 'employer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=employer' },
    action: 'առաջարկել է նոր նախագիծ',
    target: 'Մոբայլ հավելված AI-ով',
    time: '1 օր առաջ'
  },
  {
    id: 5,
    user: { name: 'Ադմինիստրատոր', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' },
    action: 'ավելացրել է նոր մասնագիտացում',
    target: 'Կիբեռանվտանգություն',
    time: '1 օր առաջ'
  },
  {
    id: 6,
    user: { name: 'Անի Հակոբյան', role: 'instructor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor2' },
    action: 'թարմացրել է դասընթացը',
    target: 'Տվյալների բազաներ',
    time: '2 օր առաջ'
  },
];

const ActivityTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Վերջին գործողություններ</CardTitle>
        <CardDescription>Համակարգում կատարված վերջին գործողությունները</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  <span className="font-semibold">{activity.user.name}</span>{' '}
                  {activity.action}{' '}
                  <span className="font-semibold">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTab;
