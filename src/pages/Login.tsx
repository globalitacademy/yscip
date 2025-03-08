
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRole } from '@/data/userRoles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAdminUser } from '@/hooks/createAdmin';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Login: React.FC = () => {
  const { login, registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [organization, setOrganization] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Try to create superadmin on page load
  useEffect(() => {
    const initSuperAdmin = async () => {
      await createAdminUser();
    };
    
    initSuperAdmin();
  }, []);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? '' : 'Մուտքագրեք վավեր էլ․ հասցե');
    return isValid;
  };

  const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters and contain uppercase, lowercase and numbers
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const isValid = passwordRegex.test(password);
    setPasswordError(isValid ? '' : 'Գաղտնաբառը պետք է պարունակի առնվազն 8 նիշ, մեծատառ, փոքրատառ և թվանշան');
    return isValid;
  };

  const validateConfirmPassword = (confirmPass: string): boolean => {
    const isValid = confirmPass === password;
    setConfirmPasswordError(isValid ? '' : 'Գաղտնաբառերը չեն համընկնում');
    return isValid;
  };

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

  const handleSuperAdminLogin = async () => {
    setEmail('superadmin@npua.am');
    setPassword('SuperAdmin123!');
    
    // Create or update superadmin account
    const result = await createAdminUser();
    if (result) {
      toast.success('Սուպերադմին հաշիվը պատրաստ է: Սեղմեք "Մուտք գործել" կոճակը');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate all fields
      const isEmailValid = validateEmail(email);
      const isPasswordValid = validatePassword(password);
      const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
      
      if (!name || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !acceptTerms) {
        if (!name) {
          toast.error('Սխալ', {
            description: 'Անուն Ազգանունը պարտադիր է',
          });
        }
        
        if (!acceptTerms) {
          toast.error('Սխալ', {
            description: 'Պետք է համաձայնեք գաղտնիության քաղաքականությանը',
          });
        }
        
        setIsLoading(false);
        return;
      }

      // Check if employer has organization
      if (role === 'employer' && !organization) {
        toast.error('Սխալ', {
          description: 'Կազմակերպության անունը պարտադիր է գործատուի համար',
        });
        setIsLoading(false);
        return;
      }

      // Check if lecturer or project_manager has department
      if ((role === 'lecturer' || role === 'project_manager') && !department) {
        toast.error('Սխալ', {
          description: 'Ֆակուլտետի անունը պարտադիր է',
        });
        setIsLoading(false);
        return;
      }

      const userData = {
        name,
        email,
        role,
        password,
        ...(role === 'employer' && { organization }),
        ...(role === 'lecturer' || role === 'project_manager' ? { department } : {})
      };

      const result = await registerUser(userData);
      
      if (result.success) {
        // Clear the form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setOrganization('');
        setDepartment('');
        setRole('student');
        setAcceptTerms(false);
        
        // Redirect to login tab
        document.getElementById('login-tab')?.click();
      } else if (result.message) {
        toast.error('Գրանցման սխալ', {
          description: result.message
        });
      }
    } catch (error: any) {
      toast.error('Սխալ', {
        description: error.message || 'Տեղի ունեցավ անսպասելի սխալ',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Role descriptions for registration form
  const getRoleDescription = (selectedRole: UserRole) => {
    switch (selectedRole) {
      case 'admin':
        return 'Կառավարել օգտատերերին, նախագծերը և համակարգը';
      case 'lecturer':
        return 'Ստեղծել առաջադրանքներ, գնահատել ուսանողներին';
      case 'project_manager':
        return 'Կառավարել նախագծերը, հետևել առաջընթացին';
      case 'employer':
        return 'Հայտարարել նոր նախագծեր, համագործակցել ուսանողների հետ';
      case 'student':
        return 'Ընտրել և կատարել նախագծեր, զարգացնել հմտություններ';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Մուտք / Գրանցում</CardTitle>
            <CardDescription>
              Մուտք գործեք համակարգ կամ ստեղծեք նոր հաշիվ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login" id="login-tab">Մուտք</TabsTrigger>
                <TabsTrigger value="register" id="register-tab">Գրանցում</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
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
                  
                  <Alert className="bg-amber-50 border-amber-200">
                    <Info className="h-4 w-4 text-amber-700" />
                    <AlertDescription className="text-amber-700 flex justify-between items-center">
                      <span>Մուտք գործեք որպես Սուպերադմին</span>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="ml-2 text-xs" 
                        onClick={handleSuperAdminLogin}
                      >
                        Մուտքի տվյալներ
                      </Button>
                    </AlertDescription>
                  </Alert>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Մուտք...' : 'Մուտք գործել'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Անուն Ազգանուն</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Անուն Ազգանուն"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Էլ․ հասցե</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (e.target.value) validateEmail(e.target.value);
                      }}
                      required
                      className={emailError ? "border-red-500" : ""}
                    />
                    {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Գաղտնաբառ</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (e.target.value) validatePassword(e.target.value);
                        if (confirmPassword) validateConfirmPassword(confirmPassword);
                      }}
                      required
                      className={passwordError ? "border-red-500" : ""}
                    />
                    {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Հաստատել գաղտնաբառը</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (e.target.value) validateConfirmPassword(e.target.value);
                      }}
                      required
                      className={confirmPasswordError ? "border-red-500" : ""}
                    />
                    {confirmPasswordError && <p className="text-sm text-red-500 mt-1">{confirmPasswordError}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Դերակատարում</Label>
                    <Select
                      value={role}
                      onValueChange={(value) => setRole(value as UserRole)}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Ընտրեք դերը" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Ուսանող</SelectItem>
                        <SelectItem value="lecturer">Դասախոս</SelectItem>
                        <SelectItem value="project_manager">Նախագծի ղեկավար</SelectItem>
                        <SelectItem value="employer">Գործատու</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getRoleDescription(role)}
                    </p>
                    
                    {/* Show warning for roles that need approval */}
                    {role !== 'student' && (
                      <p className="text-sm text-amber-600 mt-2">
                        Նշում: {role === 'employer' ? 'Գործատուի' : role === 'lecturer' ? 'Դասախոսի' : 'Ղեկավարի'} հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից:
                      </p>
                    )}
                  </div>
                  
                  {/* Show organization field only for employers */}
                  {role === 'employer' && (
                    <div className="space-y-2">
                      <Label htmlFor="organization">Կազմակերպություն</Label>
                      <Input
                        id="organization"
                        type="text"
                        placeholder="Կազմակերպության անունը"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  
                  {/* Show department field for lecturers and project managers */}
                  {(role === 'lecturer' || role === 'project_manager') && (
                    <div className="space-y-2">
                      <Label htmlFor="department">Ֆակուլտետ</Label>
                      <Input
                        id="department"
                        type="text"
                        placeholder="Ֆակուլտետի անունը"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox 
                      id="terms" 
                      checked={acceptTerms} 
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      Ես համաձայն եմ <Button variant="link" className="p-0 h-auto text-sm">գաղտնիության քաղաքականության</Button> պայմաններին
                    </Label>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Գրանցում...' : 'Գրանցվել'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              &copy; 2023 NPUA Projects. Բոլոր իրավունքները պաշտպանված են։
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
