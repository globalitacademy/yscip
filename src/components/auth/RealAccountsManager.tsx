
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, UserRole } from '@/types/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const RealAccountsManager: React.FC = () => {
  const { registerRealAccount } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<Partial<User> & { password: string }>({
    name: '',
    email: '',
    role: 'student',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    password: '',
    course: '',
    group: '',
    organization: ''
  });

  const handleOpenDialog = () => {
    setUserData({
      name: '',
      email: '',
      role: 'student',
      department: 'Ինֆորմատիկայի ֆակուլտետ',
      password: '',
      course: '',
      group: '',
      organization: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveAccount = async () => {
    // Validate inputs
    if (!userData.name) {
      toast.error('Անունը պարտադիր է');
      return;
    }
    if (!userData.email) {
      toast.error('Էլ․ հասցեն պարտադիր է');
      return;
    }
    if (!userData.password) {
      toast.error('Գաղտնաբառը պարտադիր է');
      return;
    }

    setIsLoading(true);
    try {
      const { success } = await registerRealAccount(userData);
      if (success) {
        handleCloseDialog();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showStudentFields = userData.role === 'student';
  const showEmployerFields = userData.role === 'employer';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Իրական հաշիվներ</CardTitle>
          <CardDescription>
            Ստեղծեք իրական օգտատիրական հաշիվներ համակարգում
          </CardDescription>
        </div>
        <Button
          onClick={handleOpenDialog}
          className="gap-1"
        >
          <UserPlus size={16} /> Գրանցել իրական օգտատեր
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          Որպես ադմինիստրատոր, դուք կարող եք ստեղծել նոր իրական հաշիվներ տարբեր դերերով՝ 
          ուսանողների, դասախոսների, գործատուների և ղեկավարների համար։ Ստեղծված հաշիվները 
          կլինեն անմիջապես հաստատված և պատրաստ օգտագործման։
        </p>
      </CardContent>

      {/* Account Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Գրանցել նոր իրական հաշիվ</DialogTitle>
            <DialogDescription>
              Լրացրեք ձևը նոր օգտատիրոջ հաշիվ ստեղծելու համար
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Անուն Ազգանուն
              </label>
              <Input
                id="name"
                value={userData.name || ''}
                onChange={(e) => setUserData({...userData, name: e.target.value})}
                placeholder="Օրինակ՝ Վահե Պետրոսյան"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Էլ․ հասցե
              </label>
              <Input
                id="email"
                type="email"
                value={userData.email || ''}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
                placeholder="example@example.com"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Գաղտնաբառ
              </label>
              <Input
                id="password"
                type="text"
                value={userData.password || ''}
                onChange={(e) => setUserData({...userData, password: e.target.value})}
                placeholder="Գաղտնաբառ"
              />
              <p className="text-xs text-gray-500">
                Նշեք բավականաչափ ապահով գաղտնաբառ (առնվազն 6 նիշ)
              </p>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="role" className="text-sm font-medium">
                Դերակատարում
              </label>
              <Select
                value={userData.role || 'student'}
                onValueChange={(value) => setUserData({
                  ...userData, 
                  role: value as UserRole
                })}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Ընտրեք դերակատարում" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecturer">Դասախոս</SelectItem>
                  <SelectItem value="instructor">Դասախոս (Instructor)</SelectItem>
                  <SelectItem value="supervisor">Ղեկավար</SelectItem>
                  <SelectItem value="project_manager">Նախագծի ղեկավար</SelectItem>
                  <SelectItem value="employer">Գործատու</SelectItem>
                  <SelectItem value="student">Ուսանող</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="department" className="text-sm font-medium">
                Ֆակուլտետ
              </label>
              <Input
                id="department"
                value={userData.department || ''}
                onChange={(e) => setUserData({...userData, department: e.target.value})}
                placeholder="Օրինակ՝ Ինֆորմատիկայի ֆակուլտետ"
              />
            </div>

            {showStudentFields && (
              <>
                <div className="grid gap-2">
                  <label htmlFor="course" className="text-sm font-medium">
                    Կուրս
                  </label>
                  <Select
                    value={userData.course || ''}
                    onValueChange={(value) => setUserData({...userData, course: value})}
                  >
                    <SelectTrigger id="course">
                      <SelectValue placeholder="Ընտրեք կուրսը" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1-ին կուրս</SelectItem>
                      <SelectItem value="2">2-րդ կուրս</SelectItem>
                      <SelectItem value="3">3-րդ կուրս</SelectItem>
                      <SelectItem value="4">4-րդ կուրս</SelectItem>
                      <SelectItem value="5">5-րդ կուրս</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="group" className="text-sm font-medium">
                    Խումբ
                  </label>
                  <Input
                    id="group"
                    value={userData.group || ''}
                    onChange={(e) => setUserData({...userData, group: e.target.value})}
                    placeholder="Օրինակ՝ ԿՄ-021"
                  />
                </div>
              </>
            )}

            {showEmployerFields && (
              <div className="grid gap-2">
                <label htmlFor="organization" className="text-sm font-medium">
                  Կազմակերպություն
                </label>
                <Input
                  id="organization"
                  value={userData.organization || ''}
                  onChange={(e) => setUserData({...userData, organization: e.target.value})}
                  placeholder="Օրինակ՝ ՏԵղեկատվական տեխնոլոգիաներ ՍՊԸ"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={isLoading}>
              <X size={16} className="mr-2" /> Չեղարկել
            </Button>
            <Button onClick={handleSaveAccount} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></span>
                  Պահպանում...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" /> Գրանցել
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RealAccountsManager;
