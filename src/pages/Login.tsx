
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRole, mockUsers } from '@/data/userRoles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Info, Copy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login: React.FC = () => {
  const { login, switchRole, registerUser, sendVerificationEmail, getPendingUsers } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [organization, setOrganization] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [showDeveloperInfo, setShowDeveloperInfo] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);

  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  useEffect(() => {
    // Load pending users for developer info panel
    if (showDeveloperInfo) {
      const users = getPendingUsers();
      setPendingUsers(users);
    }
  }, [showDeveloperInfo, getPendingUsers]);

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

      const userData = {
        name,
        email,
        role,
        password, // Pass password to the registerUser function
        registrationApproved: role === 'student', // Students are auto-approved
        ...(role === 'employer' && { organization })
      };

      const result = await registerUser(userData);
      
      if (result.success) {
        setVerificationSent(true);
        setResendEmail(email);
        setVerificationToken(result.token || '');
        
        // Clear the form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setOrganization('');
        setRole('student');
        setAcceptTerms(false);
      }
    } catch (error) {
      toast.error('Սխալ', {
        description: 'Տեղի ունեցավ անսպասելի սխալ',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!resendEmail) return;
    
    const result = await sendVerificationEmail(resendEmail);
    if (result.success) {
      setVerificationToken(result.token || '');
      toast.success('Հաստատման հղումը կրկին ուղարկված է', {
        description: 'Խնդրում ենք ստուգել Ձեր էլ․ փոստը'
      });
    } else {
      toast.error('Սխալ', {
        description: 'Չհաջողվեց վերաուղարկել հաստատման հղումը'
      });
    }
  };

  const copyVerificationLink = () => {
    const link = `${window.location.origin}/verify-email?token=${verificationToken}`;
    navigator.clipboard.writeText(link);
    toast.success('Հաստատման հղումը պատճենված է');
  };

  const handleQuickLogin = (role: UserRole) => {
    const user = mockUsers.find(u => u.role === role);
    if (user) {
      setEmail(user.email);
      setPassword('password'); // In a real app, we wouldn't do this
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
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="login">Մուտք</TabsTrigger>
                <TabsTrigger value="register">Գրանցում</TabsTrigger>
                <TabsTrigger value="demo">Դեմո հաշիվներ</TabsTrigger>
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
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Մուտք...' : 'Մուտք գործել'}
                  </Button>
                </form>

                <div className="mt-4">
                  <Button 
                    variant="link" 
                    className="p-0 text-xs text-muted-foreground"
                    onClick={() => setShowDeveloperInfo(!showDeveloperInfo)}
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
              </TabsContent>
              
              <TabsContent value="register">
                {verificationSent ? (
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Հաստատման հղումն ուղարկված է</AlertTitle>
                    <AlertDescription>
                      Ձեր էլ․ փոստին ուղարկվել է հաստատման հղում։ Խնդրում ենք ստուգել Ձեր փոստարկղը և սեղմել հղման վրա՝ հաշիվը ակտիվացնելու համար։
                      {role !== 'student' && (
                        <p className="mt-2 text-amber-600">
                          Նշում: {role === 'employer' ? 'Գործատուի' : role === 'lecturer' ? 'Դասախոսի' : 'Ղեկավարի'} հաշիվը պետք է նաև հաստատվի ադմինիստրատորի կողմից ակտիվացումից հետո:
                        </p>
                      )}
                      <div className="mt-4">
                        <Button onClick={handleResendVerification} size="sm" variant="outline">
                          Վերաուղարկել հաստատման հղումը
                        </Button>
                      </div>

                      {/* Verification Link Display */}
                      <div className="mt-4 bg-muted p-3 rounded-md">
                        <p className="font-medium text-sm flex items-center mb-2">
                          <Info size={14} className="mr-1" />
                          Դեմո ռեժիմում հաստատեք հաշիվը հետևյալ հղումով:
                        </p>
                        <div className="flex items-center gap-2">
                          <Input 
                            readOnly 
                            className="text-xs bg-background" 
                            value={`${window.location.origin}/verify-email?token=${verificationToken}`}
                          />
                          <Button size="sm" variant="secondary" onClick={copyVerificationLink}>
                            <Copy size={14} />
                          </Button>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
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
                )}
              </TabsContent>
              
              <TabsContent value="demo">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-4">
                    Ընտրեք ցանկացած դերակատարում՝ համակարգ մուտք գործելու համար:
                  </p>
                  
                  {mockUsers
                    .filter(user => user.registrationApproved)
                    .map(user => (
                    <div 
                      key={user.id}
                      className="flex items-center p-3 border rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => handleQuickLogin(user.role)}
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              {/* Removed "Demo version" text since we now have real accounts */}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
