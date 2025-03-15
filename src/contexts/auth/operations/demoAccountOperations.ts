
import { DemoAccount } from '@/types/auth';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useDemoAccountOperations = (
  demoAccounts: DemoAccount[] | undefined,
  setDemoAccounts: React.Dispatch<React.SetStateAction<DemoAccount[]>>
) => {
  const manageDemoAccount = async (account: DemoAccount, action: 'add' | 'update' | 'delete'): Promise<boolean> => {
    if (!demoAccounts) return false;
    
    try {
      let updatedAccounts: DemoAccount[] = [...demoAccounts];
      
      switch (action) {
        case 'add':
          // Check if account with same email already exists
          if (updatedAccounts.some(a => a.email.toLowerCase() === account.email.toLowerCase())) {
            toast.error('Այս էլ․ հասցեով դեմո հաշիվն արդեն գոյություն ունի');
            return false;
          }
          
          // Generate ID if not provided
          if (!account.id) {
            account.id = uuidv4();
          }
          
          updatedAccounts.push(account);
          toast.success(`Դեմո հաշիվը հաջողությամբ ավելացվել է՝ ${account.name}`);
          break;
          
        case 'update':
          // Find the index of the account to update
          const updateIndex = updatedAccounts.findIndex(a => a.id === account.id);
          
          if (updateIndex === -1) {
            toast.error('Դեմո հաշիվը չի գտնվել');
            return false;
          }
          
          // Check if trying to update to an email that already exists
          const duplicateEmailIndex = updatedAccounts.findIndex(
            a => a.id !== account.id && a.email.toLowerCase() === account.email.toLowerCase()
          );
          
          if (duplicateEmailIndex !== -1) {
            toast.error('Այս էլ․ հասցեն արդեն օգտագործվում է այլ դեմո հաշվի կողմից');
            return false;
          }
          
          updatedAccounts[updateIndex] = account;
          toast.success(`Դեմո հաշիվը հաջողությամբ թարմացվել է՝ ${account.name}`);
          break;
          
        case 'delete':
          // Filter out the account to delete
          updatedAccounts = updatedAccounts.filter(a => a.id !== account.id);
          toast.success(`Դեմո հաշիվը հաջողությամբ ջնջվել է`);
          break;
      }
      
      // Update state and localStorage
      setDemoAccounts(updatedAccounts);
      localStorage.setItem('demoAccounts', JSON.stringify(updatedAccounts));
      
      return true;
    } catch (error) {
      console.error(`Error ${action}ing demo account:`, error);
      toast.error(`Սխալ դեմո հաշիվը ${action === 'add' ? 'ավելացնելիս' : action === 'update' ? 'թարմացնելիս' : 'ջնջելիս'}`);
      return false;
    }
  };

  return {
    manageDemoAccount
  };
};
