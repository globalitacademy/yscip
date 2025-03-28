
import { useState, useEffect } from 'react';
import { PendingUser } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);

  // Load pending users from Supabase on mount
  useEffect(() => {
    const loadPendingUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('registration_approved', false);
          
        if (error) throw error;
        
        const formatted: PendingUser[] = data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at
        }));
        
        setPendingUsers(formatted);
      } catch (error) {
        console.error('Error loading pending users:', error);
        toast.error('Չհաստատված օգտատերերի բեռնման ժամանակ սխալ է տեղի ունեցել');
      }
    };

    loadPendingUsers();
  }, []);

  return { pendingUsers, setPendingUsers };
};
