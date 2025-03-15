
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DemoAccount } from '@/types/auth';
import { UserRole } from '@/types/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const DemoAccountsManager: React.FC = () => {
  const { demoAccounts, manageDemoAccount } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<DemoAccount>({
    id: '',
    name: '',
    email: '',
    role: 'student',
    password: ''
  });

  const handleOpenDialog = (isEdit: boolean, account?: DemoAccount) => {
    if (isEdit && account) {
      setCurrentAccount({ ...account });
      setIsEditing(true);
    } else {
      setCurrentAccount({
        id: uuidv4(),
        name: '',
        email: '',
        role: 'student',
        password: ''
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentAccount({
      id: '',
      name: '',
      email: '',
      role: 'student',
      password: ''
    });
  };

  const handleSaveAccount = async () => {
    // Validate inputs
    if (!currentAccount.name) {
      toast.error('Անունը պարտադիր է');
      return;
    }
    if (!currentAccount.email) {
      toast.error('Էլ․ հասցեն պարտադիր է');
      return;
    }
    if (!currentAccount.password) {
      toast.error('Գաղտնաբառը պարտադիր է');
      return;
    }

    const success = await manageDemoAccount(
      currentAccount, 
      isEditing ? 'update' : 'add'
    );

    if (success) {
      handleCloseDialog();
    }
  };

  const handleDeleteAccount = async (account: DemoAccount) => {
    if (window.confirm(`Հաստատեք "${account.name}" դեմո հաշվի ջնջումը։`)) {
      await manageDemoAccount(account, 'delete');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default">Ադմինիստրատոր</Badge>;
      case 'lecturer':
      case 'instructor':
        return <Badge variant="secondary">Դասախոս</Badge>;
      case 'supervisor':
        return <Badge variant="outline">Ղեկավար</Badge>;
      case 'project_manager':
        return <Badge variant="destructive">Նախագծի ղեկավար</Badge>;
      case 'employer':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700">Գործատու</Badge>;
      case 'student':
      default:
        return <Badge variant="outline" className="bg-blue-100 text-blue-700">Ուսանող</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Դեմո հաշիվներ</CardTitle>
          <CardDescription>
            Կառավարեք համակարգի դեմո հաշիվները ներկայացման համար
          </CardDescription>
        </div>
        <Button
          onClick={() => handleOpenDialog(false)}
          className="gap-1"
        >
          <Plus size={16} /> Ավելացնել
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Անուն</TableHead>
              <TableHead>Էլ․ հասցե</TableHead>
              <TableHead>Դերակատարում</TableHead>
              <TableHead>Գաղտնաբառ</TableHead>
              <TableHead className="text-right">Գործողություններ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demoAccounts && demoAccounts.length > 0 ? (
              demoAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{getRoleBadge(account.role)}</TableCell>
                  <TableCell className="font-mono text-sm">{account.password}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(true, account)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAccount(account)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  Դեմո հաշիվներ չկան։ Ավելացրեք առնվազն մեկը։
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Account Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Խմբագրել դեմո հաշիվը' : 'Ավելացնել նոր դեմո հաշիվ'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Խմբագրեք դեմո հաշվի տվյալները'
                : 'Լրացրեք ձևը նոր դեմո հաշիվ ստեղծելու համար'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Անուն
              </label>
              <Input
                id="name"
                value={currentAccount.name}
                onChange={(e) => setCurrentAccount({...currentAccount, name: e.target.value})}
                placeholder="Օրինակ՝ Դասախոս Օգտատեր"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Էլ․ հասցե
              </label>
              <Input
                id="email"
                type="email"
                value={currentAccount.email}
                onChange={(e) => setCurrentAccount({...currentAccount, email: e.target.value})}
                placeholder="example@example.com"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="role" className="text-sm font-medium">
                Դերակատարում
              </label>
              <Select
                value={currentAccount.role}
                onValueChange={(value) => setCurrentAccount({
                  ...currentAccount, 
                  role: value as UserRole
                })}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Ընտրեք դերակատարում" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Ադմինիստրատոր</SelectItem>
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
              <label htmlFor="password" className="text-sm font-medium">
                Գաղտնաբառ
              </label>
              <Input
                id="password"
                type="text"
                value={currentAccount.password}
                onChange={(e) => setCurrentAccount({...currentAccount, password: e.target.value})}
                placeholder="Գաղտնաբառ"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              <X size={16} className="mr-2" /> Չեղարկել
            </Button>
            <Button onClick={handleSaveAccount}>
              <Save size={16} className="mr-2" /> Պահպանել
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DemoAccountsManager;
