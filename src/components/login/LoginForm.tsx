
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, LucideUserCheck, LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleMagicLinkLogin: () => Promise<void>;
  isLoading: boolean;
  handleSuperAdminLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  handleMagicLinkLogin,
  isLoading,
  handleSuperAdminLogin
}) => {
  return (
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
      
      <div className="flex items-center justify-between">
        <Button 
          variant="link" 
          type="button" 
          className="p-0 h-auto text-sm"
          onClick={() => toast.info("Գաղտնաբառի վերականգնման գործառույթը ակտիվ չէ")}
        >
          Մոռացել եք գաղտնաբառը?
        </Button>
        
        <Button 
          variant="link"
          type="button"
          className="p-0 h-auto text-sm flex items-center gap-1"
          onClick={handleMagicLinkLogin}
        >
          <LinkIcon className="h-3 w-3" />
          <span>Magic Link</span>
        </Button>
      </div>
      
      <Alert className="bg-amber-50 border-amber-200">
        <Info className="h-4 w-4 text-amber-700" />
        <AlertDescription className="text-amber-700 flex justify-between items-center">
          <span>Մուտք գործեք որպես Սուպերադմին</span>
          <Button 
            type="button" 
            variant="outline" 
            className="ml-2 text-xs flex items-center gap-1" 
            onClick={handleSuperAdminLogin}
          >
            <LucideUserCheck className="h-3 w-3" />
            <span>Լրացնել տվյալները</span>
          </Button>
        </AlertDescription>
      </Alert>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Մուտք...' : 'Մուտք գործել'}
      </Button>
      
      <div className="text-center">
        <Button 
          variant="ghost" 
          type="button" 
          className="text-xs"
          onClick={handleMagicLinkLogin}
        >
          Մուտք գործել Magic Link-ով
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
