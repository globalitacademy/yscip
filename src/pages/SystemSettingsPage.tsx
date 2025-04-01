
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SystemSettingsPage: React.FC = () => {
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'notifications@example.com',
    smtpPassword: '••••••••••••',
    senderEmail: 'notifications@example.com',
    senderName: 'ՀՊՏՀ Ծանուցումներ',
    enableEmails: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    requireAdminApproval: true,
    passwordMinLength: '8',
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    loginAttempts: '5',
    sessionTimeout: '60'
  });

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'ՀՊՏՀ - Կառավարման վահանակ',
    language: 'hy',
    timezone: 'Asia/Yerevan',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    enableRegistration: true
  });

  return (
    <AdminLayout pageTitle="Համակարգի կարգավորումներ">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-1/2 mb-6">
          <TabsTrigger value="general">Ընդհանուր</TabsTrigger>
          <TabsTrigger value="email">Էլ․ փոստ</TabsTrigger>
          <TabsTrigger value="security">Անվտանգություն</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Ընդհանուր կարգավորումներ</CardTitle>
              <CardDescription>Համակարգի ընդհանուր կարգավորումներ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Կայքի անվանում</Label>
                  <Input 
                    id="siteName" 
                    value={generalSettings.siteName} 
                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Լեզու</Label>
                  <Select 
                    value={generalSettings.language}
                    onValueChange={(value) => setGeneralSettings({...generalSettings, language: value})}
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
                    value={generalSettings.timezone}
                    onValueChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Ընտրեք ժամային գոտին" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Yerevan">Երևան (GMT+4)</SelectItem>
                      <SelectItem value="Europe/Moscow">Մոսկվա (GMT+3)</SelectItem>
                      <SelectItem value="Europe/Paris">Փարիզ (GMT+1)</SelectItem>
                      <SelectItem value="America/New_York">Նյու Յորք (GMT-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Ամսաթվի ֆորմատ</Label>
                  <Select 
                    value={generalSettings.dateFormat}
                    onValueChange={(value) => setGeneralSettings({...generalSettings, dateFormat: value})}
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue placeholder="Ընտրեք ամսաթվի ֆորմատը" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Ժամանակի ֆորմատ</Label>
                  <Select 
                    value={generalSettings.timeFormat}
                    onValueChange={(value) => setGeneralSettings({...generalSettings, timeFormat: value})}
                  >
                    <SelectTrigger id="timeFormat">
                      <SelectValue placeholder="Ընտրեք ժամանակի ֆորմատը" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 ժամյա (14:30)</SelectItem>
                      <SelectItem value="12h">12 ժամյա (2:30 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="enableRegistration" 
                  checked={generalSettings.enableRegistration}
                  onCheckedChange={(checked) => setGeneralSettings({...generalSettings, enableRegistration: checked})}
                />
                <Label htmlFor="enableRegistration">Թույլատրել օգտատերերի գրանցումը</Label>
              </div>
              
              <Button className="mt-4">Պահպանել փոփոխությունները</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Էլ․ փոստի կարգավորումներ</CardTitle>
              <CardDescription>Կարգավորեք համակարգի էլ․ փոստի հաղորդակցությունը</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">SMTP սերվեր</Label>
                  <Input 
                    id="smtpServer" 
                    value={emailSettings.smtpServer}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP պորտ</Label>
                  <Input 
                    id="smtpPort" 
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP օգտանուն</Label>
                  <Input 
                    id="smtpUsername" 
                    value={emailSettings.smtpUsername}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP գաղտնաբառ</Label>
                  <Input 
                    id="smtpPassword" 
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Ուղարկողի էլ․ փոստ</Label>
                  <Input 
                    id="senderEmail" 
                    value={emailSettings.senderEmail}
                    onChange={(e) => setEmailSettings({...emailSettings, senderEmail: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderName">Ուղարկողի անուն</Label>
                  <Input 
                    id="senderName" 
                    value={emailSettings.senderName}
                    onChange={(e) => setEmailSettings({...emailSettings, senderName: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="enableEmails" 
                  checked={emailSettings.enableEmails}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableEmails: checked})}
                />
                <Label htmlFor="enableEmails">Միացնել էլ․ փոստի ծանուցումները</Label>
              </div>
              
              <Button className="mt-4">Պահպանել փոփոխությունները</Button>
              <Button variant="outline" className="ml-2">Ուղարկել թեստային նամակ</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Անվտանգության կարգավորումներ</CardTitle>
              <CardDescription>Կարգավորեք համակարգի անվտանգության պարամետրերը</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Գաղտնաբառի նվազագույն երկարություն</Label>
                  <Input 
                    id="passwordMinLength" 
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Մուտքի առավելագույն փորձեր</Label>
                  <Input 
                    id="loginAttempts" 
                    type="number"
                    value={securitySettings.loginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, loginAttempts: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Սեսիայի տևողություն (րոպե)</Label>
                  <Input 
                    id="sessionTimeout" 
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="requireEmailVerification" 
                    checked={securitySettings.requireEmailVerification}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({...securitySettings, requireEmailVerification: checked})
                    }
                  />
                  <Label htmlFor="requireEmailVerification">Պահանջել էլ․ փոստի հաստատում</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="requireAdminApproval" 
                    checked={securitySettings.requireAdminApproval}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({...securitySettings, requireAdminApproval: checked})
                    }
                  />
                  <Label htmlFor="requireAdminApproval">Պահանջել ադմինիստրատորի հաստատում</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="passwordRequireNumbers" 
                    checked={securitySettings.passwordRequireNumbers}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({...securitySettings, passwordRequireNumbers: checked})
                    }
                  />
                  <Label htmlFor="passwordRequireNumbers">Գաղտնաբառում պետք է լինեն թվեր</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="passwordRequireSymbols" 
                    checked={securitySettings.passwordRequireSymbols}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({...securitySettings, passwordRequireSymbols: checked})
                    }
                  />
                  <Label htmlFor="passwordRequireSymbols">Գաղտնաբառում պետք է լինեն հատուկ նշաններ</Label>
                </div>
              </div>
              
              <Button className="mt-4">Պահպանել փոփոխությունները</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default SystemSettingsPage;
