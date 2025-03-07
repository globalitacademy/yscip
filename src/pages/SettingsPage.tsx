
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  // System settings
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'Դիպլոմային աշխատանքների կառավարման համակարգ',
    siteDescription: 'Հարթակ՝ ուսանողների, ղեկավարների և գործատուների միջև դիպլոմային աշխատանքների կառավարման համար',
    language: 'hy',
    timezone: 'Asia/Yerevan',
    maintenanceMode: false,
    debugMode: false,
    registrationOpen: true
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    systemNotifications: true,
    dailyDigest: false,
    newProjectNotification: true,
    taskDueReminders: true,
    projectApprovalNotifications: true
  });

  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'notifications@example.com',
    smtpPassword: '**********',
    fromName: 'Դիպլոմային աշխատանքների համակարգ',
    fromEmail: 'notifications@example.com'
  });

  // Handle system settings change
  const handleSystemSettingChange = (key: string, value: any) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
  };

  // Handle notification settings change
  const handleNotificationSettingChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  // Handle email settings change
  const handleEmailSettingChange = (key: string, value: string) => {
    setEmailSettings(prev => ({ ...prev, [key]: value }));
  };

  // Save settings
  const saveSettings = (settingType: string) => {
    toast.success(`${settingType} կարգավորումները հաջողությամբ պահպանվեցին`);
  };

  return (
    <AdminLayout pageTitle="Կարգավորումներ">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Ընդհանուր</TabsTrigger>
          <TabsTrigger value="notifications">Ծանուցումներ</TabsTrigger>
          <TabsTrigger value="email">Էլ. փոստ</TabsTrigger>
          <TabsTrigger value="system">Համակարգ</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Ընդհանուր կարգավորումներ</CardTitle>
              <CardDescription>Կազմաձևեք համակարգի հիմնական կարգավորումները</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Կայքի անվանում</Label>
                <Input 
                  id="site-name" 
                  value={systemSettings.siteName} 
                  onChange={(e) => handleSystemSettingChange('siteName', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-description">Կայքի նկարագրություն</Label>
                <Input 
                  id="site-description" 
                  value={systemSettings.siteDescription} 
                  onChange={(e) => handleSystemSettingChange('siteDescription', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Լեզու</Label>
                <Select 
                  value={systemSettings.language}
                  onValueChange={(value) => handleSystemSettingChange('language', value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Ընտրեք լեզուն" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hy">Հայերեն</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Ժամային գոտի</Label>
                <Select 
                  value={systemSettings.timezone}
                  onValueChange={(value) => handleSystemSettingChange('timezone', value)}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Ընտրեք ժամային գոտին" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Yerevan">Երևան (GMT+4)</SelectItem>
                    <SelectItem value="Europe/Moscow">Մոսկվա (GMT+3)</SelectItem>
                    <SelectItem value="Europe/Berlin">Բեռլին (GMT+2)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="registration">Գրանցման հնարավորություն</Label>
                  <p className="text-xs text-muted-foreground">
                    Թույլատրել նոր օգտատերերի գրանցումը
                  </p>
                </div>
                <Switch 
                  id="registration"
                  checked={systemSettings.registrationOpen}
                  onCheckedChange={(checked) => handleSystemSettingChange('registrationOpen', checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings('Ընդհանուր')}>Պահպանել կարգավորումները</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Ծանուցումների կարգավորումներ</CardTitle>
              <CardDescription>Կազմաձևեք, թե ինչպես պետք է ստանաք ծանուցումները</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Էլ. փոստի ծանուցումներ</Label>
                  <p className="text-xs text-muted-foreground">
                    Ստանալ ծանուցումներ էլ. փոստի միջոցով
                  </p>
                </div>
                <Switch 
                  id="email-notifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationSettingChange('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">SMS ծանուցումներ</Label>
                  <p className="text-xs text-muted-foreground">
                    Ստանալ ծանուցումներ SMS-ի միջոցով
                  </p>
                </div>
                <Switch 
                  id="sms-notifications"
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) => handleNotificationSettingChange('smsNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="system-notifications">Համակարգային ծանուցումներ</Label>
                  <p className="text-xs text-muted-foreground">
                    Ստանալ ծանուցումներ համակարգում
                  </p>
                </div>
                <Switch 
                  id="system-notifications"
                  checked={notificationSettings.systemNotifications}
                  onCheckedChange={(checked) => handleNotificationSettingChange('systemNotifications', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="daily-digest">Օրական ամփոփում</Label>
                  <p className="text-xs text-muted-foreground">
                    Ստանալ օրական ամփոփագիր էլ. փոստով
                  </p>
                </div>
                <Switch 
                  id="daily-digest"
                  checked={notificationSettings.dailyDigest}
                  onCheckedChange={(checked) => handleNotificationSettingChange('dailyDigest', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-project">Նոր նախագծեր</Label>
                  <p className="text-xs text-muted-foreground">
                    Ծանուցել նոր նախագծերի ավելացման մասին
                  </p>
                </div>
                <Switch 
                  id="new-project"
                  checked={notificationSettings.newProjectNotification}
                  onCheckedChange={(checked) => handleNotificationSettingChange('newProjectNotification', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="task-reminders">Առաջադրանքների հիշեցումներ</Label>
                  <p className="text-xs text-muted-foreground">
                    Ստանալ հիշեցումներ վերջնաժամկետների մասին
                  </p>
                </div>
                <Switch 
                  id="task-reminders"
                  checked={notificationSettings.taskDueReminders}
                  onCheckedChange={(checked) => handleNotificationSettingChange('taskDueReminders', checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings('Ծանուցումների')}>Պահպանել կարգավորումները</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Էլ. փոստի կարգավորումներ</CardTitle>
              <CardDescription>Կարգավորեք էլեկտրոնային փոստի ուղարկման համակարգը</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-server">SMTP սերվեր</Label>
                <Input 
                  id="smtp-server" 
                  value={emailSettings.smtpServer} 
                  onChange={(e) => handleEmailSettingChange('smtpServer', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP պորտ</Label>
                <Input 
                  id="smtp-port" 
                  value={emailSettings.smtpPort} 
                  onChange={(e) => handleEmailSettingChange('smtpPort', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-username">SMTP օգտանուն</Label>
                <Input 
                  id="smtp-username" 
                  value={emailSettings.smtpUsername} 
                  onChange={(e) => handleEmailSettingChange('smtpUsername', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-password">SMTP գաղտնաբառ</Label>
                <Input 
                  id="smtp-password" 
                  type="password"
                  value={emailSettings.smtpPassword} 
                  onChange={(e) => handleEmailSettingChange('smtpPassword', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="from-name">Ուղարկողի անուն</Label>
                <Input 
                  id="from-name" 
                  value={emailSettings.fromName} 
                  onChange={(e) => handleEmailSettingChange('fromName', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="from-email">Ուղարկողի էլ. հասցե</Label>
                <Input 
                  id="from-email" 
                  value={emailSettings.fromEmail} 
                  onChange={(e) => handleEmailSettingChange('fromEmail', e.target.value)} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings('Էլ. փոստի')}>Պահպանել կարգավորումները</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>Համակարգային կարգավորումներ</CardTitle>
              <CardDescription>Կարգավորեք համակարգային ընդլայնված կարգավորումները</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Սպասարկման ռեժիմ</Label>
                  <p className="text-xs text-muted-foreground">
                    Միացնել կայքի սպասարկման ռեժիմը
                  </p>
                </div>
                <Switch 
                  id="maintenance-mode"
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={(checked) => handleSystemSettingChange('maintenanceMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="debug-mode">Կարգաբերման (Debug) ռեժիմ</Label>
                  <p className="text-xs text-muted-foreground">
                    Միացնել մանրամասն սխալների ցուցադրումը
                  </p>
                </div>
                <Switch 
                  id="debug-mode"
                  checked={systemSettings.debugMode}
                  onCheckedChange={(checked) => handleSystemSettingChange('debugMode', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Համակարգի օպտիմիզացիա</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">Մաքրել քեշը</Button>
                  <Button variant="outline" className="w-full">Օպտիմիզացնել տվյալների բազան</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Տվյալների պահուստավորում</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">Ստեղծել պահուստային պատճեն</Button>
                  <Button variant="outline" className="w-full">Վերականգնել պահուստից</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => saveSettings('Համակարգային')}>Պահպանել կարգավորումները</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default SettingsPage;
