
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { toast } from 'sonner';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Շնորհակալություն հաղորդագրության համար', {
        description: 'Մենք կպատասխանենք ձեզ հնարավորինս շուտ'
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-background text-foreground' : 'bg-white text-gray-900'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Կապ մեզ հետ</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Ունե՞ք հարցեր կամ առաջարկներ: Կապվեք մեզ հետ ստորև նշված եղանակներով կամ լրացրեք կապի ձևը, և մենք կպատասխանենք Ձեզ հնարավորինս շուտ։
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Էլ․ փոստ</h3>
                    <p className="text-muted-foreground">info@learnwithoutborders.am</p>
                    <p className="text-muted-foreground">support@learnwithoutborders.am</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Հեռախոս</h3>
                    <p className="text-muted-foreground">+374 10 123456</p>
                    <p className="text-muted-foreground">+374 99 987654</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Հասցե</h3>
                    <p className="text-muted-foreground">Երևան, Հայաստան</p>
                    <p className="text-muted-foreground">Ամիրյան 10, 3-րդ հարկ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Աշխատանքային ժամեր</h3>
                    <p className="text-muted-foreground">Երկ-Ուրբ․ 9:00 - 18:00</p>
                    <p className="text-muted-foreground">Շաբաթ․ 10:00 - 15:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-4">Կապի ձև</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Անուն</label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Էլ․ փոստ</label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Թեմա</label>
                    <Input 
                      id="subject" 
                      value={subject} 
                      onChange={(e) => setSubject(e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Հաղորդագրություն</label>
                    <Textarea 
                      id="message" 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)} 
                      rows={5} 
                      required 
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Ուղարկվում է...' : 'Ուղարկել հաղորդագրություն'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
