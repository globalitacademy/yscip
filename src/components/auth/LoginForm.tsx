
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import DeveloperInfo from './DeveloperInfo';

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

  const handleToggleDeveloperInfo = () => {
    onShowDeveloperInfo();
    if (!showDeveloperInfo) {
      const users = getPendingUsers();
      setPendingUsers(users);
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

      <DeveloperInfo 
        showDeveloperInfo={showDeveloperInfo} 
        onToggleDeveloperInfo={handleToggleDeveloperInfo} 
        pendingUsers={pendingUsers} 
      />
    </>
  );
};

export default LoginForm;
