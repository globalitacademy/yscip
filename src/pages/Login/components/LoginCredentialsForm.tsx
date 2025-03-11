
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginValidationSchema } from '../validation';
import ForgotPasswordForm from './ForgotPasswordForm';

interface LoginCredentialsFormProps {
  onLogin?: (email: string, password: string) => Promise<void>;
  onResetEmailSent?: () => void;
  externalLoading?: boolean;
  isLoading?: boolean;
}

const LoginCredentialsForm: React.FC<LoginCredentialsFormProps> = ({ 
  onLogin, 
  onResetEmailSent,
  externalLoading,
  isLoading: propIsLoading
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const isLoading = propIsLoading || externalLoading || false;

  const form = useForm<z.infer<typeof loginValidationSchema>>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginValidationSchema>) => {
    try {
      setFormError(null);
      if (onLogin) {
        await onLogin(values.email, values.password);
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Մուտքի սխալ');
    }
  };

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.email) {
        setEmail(value.email as string);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Էլ․ հասցե</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Գաղտնաբառ</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Մուտքագրեք գաղտնաբառը"
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">Show password</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {formError && (
          <div className="text-sm text-red-500">{formError}</div>
        )}
        
        <div className="flex justify-end">
          <ForgotPasswordForm 
            email={email} 
            onReset={onResetEmailSent || (() => {})} 
          />
        </div>
        
        <Button disabled={isLoading} className="w-full" type="submit">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Մուտք գործել...
            </>
          ) : (
            'Մուտք գործել'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginCredentialsForm;
