
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const createAdminUser = async () => {
  try {
    // Ստուգենք կա արդեն ադմին օգտատեր
    const { data: { users }, error: getUsersError } = await supabase.auth.admin.listUsers();
    
    if (getUsersError) {
      console.error('Չհաջողվեց ստուգել օգտատերերին:', getUsersError);
      toast.error('Չհաջողվեց ստուգել օգտատերերին');
      return false;
    }
    
    // Ստուգում ենք կա արդեն ադմին օգտատեր
    const adminExists = users?.some(user => 
      user.user_metadata?.role === 'admin' && 
      user.email === 'admin@npua.am'
    );
    
    if (adminExists) {
      console.log('Ադմին օգտատերը արդեն գոյություն ունի');
      toast.success('Ադմին օգտատերը արդեն գոյություն ունի։ Օգտագործեք admin@npua.am / Admin123!');
      return true;
    }
    
    // Ստեղծում ենք ադմին օգտատեր
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@npua.am',
      password: 'Admin123!',
      email_confirm: true,
      user_metadata: {
        name: 'Ադմինիստրատոր',
        role: 'admin',
        registration_approved: true,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin${Date.now()}`
      }
    });
    
    if (error) {
      console.error('Չհաջողվեց ստեղծել ադմին օգտատեր:', error);
      toast.error('Չհաջողվեց ստեղծել ադմին օգտատեր: ' + error.message);
      return false;
    }
    
    console.log('Ադմին օգտատերը հաջողությամբ ստեղծվել է:', data);
    toast.success('Ադմին օգտատերը հաջողությամբ ստեղծվել է։ Օգտագործեք admin@npua.am / Admin123!');
    return true;
  } catch (error) {
    console.error('Սխալ ադմին օգտատեր ստեղծելիս:', error);
    toast.error('Սխալ ադմին օգտատեր ստեղծելիս: ' + (error as Error).message);
    return false;
  }
};
