
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ProjectProposalForm: React.FC = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [duration, setDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      toast.error('Լրացրեք պարտադիր դաշտերը');
      return;
    }
    
    if (!user) {
      toast.error('Դուք չեք մուտք գործել համակարգ');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('project_proposals')
        .insert([{
          title,
          description,
          requirements,
          duration,
          employer_id: user.id,
          organization: user.organization
        }]);
        
      if (error) {
        console.error('Error submitting proposal:', error);
        throw error;
      }
      
      // Reset form
      setTitle('');
      setDescription('');
      setRequirements('');
      setDuration('');
      
      toast.success('Նախագծի առաջարկն ուղարկված է');
    } catch (error) {
      toast.error('Տեղի ունեցավ սխալ: Խնդրում ենք փորձել կրկին');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Նոր նախագծի առաջարկ</CardTitle>
        <CardDescription>
          Լրացրեք ձևաթուղթը՝ նոր նախագիծ առաջարկելու համար
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Վերնագիր *</Label>
            <Input 
              id="title" 
              placeholder="Նախագծի վերնագիր" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Նկարագրություն *</Label>
            <Textarea 
              id="description" 
              placeholder="Մանրամասն նկարագրեք նախագիծը" 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="requirements">Տեխնիկական պահանջներ</Label>
            <Textarea 
              id="requirements" 
              placeholder="Ինչ տեխնոլոգիաներ, գործիքներ կամ հմտություններ են անհրաժեշտ" 
              rows={3}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Տևողություն</Label>
            <Input 
              id="duration" 
              placeholder="Օր.՝ 3 ամիս" 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline">Չեղարկել</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Ուղարկվում է...' : 'Ուղարկել առաջարկը'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProjectProposalForm;
