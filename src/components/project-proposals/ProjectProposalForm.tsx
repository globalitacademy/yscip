
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ProjectProposalForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [duration, setDuration] = useState('');
  const [organization, setOrganization] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Խնդրում ենք մուտք գործել համակարգ');
      return;
    }
    
    if (!title.trim() || !description.trim()) {
      toast.error('Լրացրեք պարտադիր դաշտերը');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('project_proposals').insert({
        title,
        description,
        requirements: requirements || null,
        duration: duration || null,
        organization: organization || null,
        employer_id: user.id,
        status: 'pending'
      });
      
      if (error) throw error;
      
      toast.success('Նախագծի առաջարկը հաջողությամբ ուղարկված է');
      
      // Մաքրում ենք ձևը
      setTitle('');
      setDescription('');
      setRequirements('');
      setDuration('');
      setOrganization('');
      
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast.error('Սխալ նախագծի առաջարկը ուղարկելիս');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Վերնագիր<span className="text-red-500">*</span></Label>
            <Input
              id="title"
              placeholder="Նախագծի վերնագիր"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Նկարագրություն<span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              placeholder="Մանրամասն նկարագրեք նախագիծը"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-32"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="requirements">Պահանջներ</Label>
            <Textarea
              id="requirements"
              placeholder="Ինչ գիտելիքներ և հմտություններ են անհրաժեշտ"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="min-h-24"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Տևողություն</Label>
              <Input
                id="duration"
                placeholder="Օր․՝ 3 ամիս"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="organization">Կազմակերպություն</Label>
              <Input
                id="organization"
                placeholder="Ձեր կազմակերպության անվանումը"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ուղարկվում է...
              </>
            ) : 'Ուղարկել առաջարկը'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectProposalForm;
