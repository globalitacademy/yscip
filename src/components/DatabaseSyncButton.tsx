
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { databaseSyncService } from '@/services/databaseSyncService';
import { toast } from 'sonner';

interface DatabaseSyncButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

const DatabaseSyncButton: React.FC<DatabaseSyncButtonProps> = ({ 
  variant = 'outline',
  className = ''
}) => {
  const [syncing, setSyncing] = useState(false);
  
  const handleSync = async () => {
    if (syncing) return;
    
    setSyncing(true);
    toast.info('Տվյալների համաժամեցման գործընթացը սկսվել է...');
    
    try {
      const success = await databaseSyncService.syncAllData();
      if (success) {
        toast.success('Տվյալները հաջողությամբ համաժամեցվել են բազայի հետ');
      } else {
        toast.error('Տվյալների համաժամեցումը մասամբ է հաջողվել');
      }
    } catch (error) {
      console.error('Error syncing data:', error);
      toast.error('Տվյալների համաժամեցման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setSyncing(false);
    }
  };
  
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleSync}
      disabled={syncing}
      className={`flex items-center gap-2 ${className}`}
    >
      {syncing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
      Համաժամեցնել
    </Button>
  );
};

export default DatabaseSyncButton;
