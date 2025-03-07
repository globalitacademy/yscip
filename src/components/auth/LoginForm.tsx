
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Info, Copy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LoginFormProps {
  onShowDeveloperInfo: () => void;
  showDeveloperInfo: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onShowDeveloperInfo, showDeveloperInfo }) => {
  const { login, getPendingUsers } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Մուտքն հաջողվել է', {
          description: 'Դուք հաջողությամբ մուտք եք գործել համակարգ',
        });
        navigate('/');
      } else {
        toast.error('Մուտքը չի հաջողվել', {
          description: 'Էլ․ հասցեն կամ գաղտնաբառը սխալ է կամ Ձեր հաշիվը դեռ ակտիվացված չէ',
        });
      }
    } catch (error) {
      toast.error('Սխալ', {
        description: 'Տեղի ունեցավ անսպասելի սխալ',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Էլ․ հասցե</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Գաղտնաբառ</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="flex items-center justify-end">
          <Button variant="link" type="button" className="p-0 h-auto text-sm">
            Մոռացել եք գաղտնաբառը?
          </Button>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Մուտք...' : 'Մուտք գործել'}
        </Button>
      </form>

      <div className="mt-4">
        <Button 
          variant="link" 
          className="p-0 text-xs text-muted-foreground"
          onClick={() => {
            onShowDeveloperInfo();
            if (!showDeveloperInfo) {
              const users = getPendingUsers();
              setPendingUsers(users);
            }
          }}
        >
          {showDeveloperInfo ? 'Թաքցնել մշակողի տեղեկատվությունը' : 'Ցուցադրել մշակողի տեղեկատվությունը'}
        </Button>
      </div>

      {showDeveloperInfo && (
        <div className="mt-4 p-4 border rounded-md bg-muted/50">
          <h3 className="font-medium mb-2 flex items-center gap-1">
            <Info size={16} />
            Մշակողի գործիքակազմ
          </h3>
          <p className="text-sm text-muted-foreground mb-2">Սուպերադմինի հաշիվ՝</p>
          <div className="text-sm bg-muted p-2 rounded-md mb-3">
            <div><strong>Էլ․ հասցե:</strong> superadmin@example.com</div>
            <div><strong>Գաղտնաբառ:</strong> SuperAdmin123</div>
          </div>

          <p className="text-sm text-muted-foreground mb-2">Սպասման մեջ գտնվող օգտատերեր՝</p>
          <div className="max-h-40 overflow-auto text-xs">
            {pendingUsers.length === 0 ? (
              <p className="text-muted-foreground">Չկան սպասման մեջ գտնվող օգտատերեր</p>
            ) : (
              <ul className="space-y-2">
                {pendingUsers.map((user, index) => (
                  <li key={index} className="p-2 bg-muted rounded-md">
                    <div><strong>Անուն:</strong> {user.name}</div>
                    <div><strong>Էլ․ հասցե:</strong> {user.email}</div>
                    <div><strong>Դերակատարում:</strong> {user.role}</div>
                    <div><strong>Հաստատված:</strong> {user.verified ? 'Այո' : 'Ոչ'}</div>
                    <div><strong>Թույլատրված:</strong> {user.registrationApproved ? 'Այո' : 'Ոչ'}</div>
                    <div className="flex items-center">
                      <strong>Հաստատման հղում:</strong>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 px-2 ml-1"
                        onClick={() => {
                          const link = `${window.location.origin}/verify-email?token=${user.verificationToken}`;
                          navigator.clipboard.writeText(link);
                          toast.success('Հաստատման հղումը պատճենված է');
                        }}
                      >
                        <Copy size={12} />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;
