
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { databaseSyncService } from '@/services/databaseSyncService';
import { toast } from 'sonner';

interface DatabaseSyncButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

const DatabaseSyncButton: React.FC<DatabaseSyncButtonProps> = ({ 
  variant = 'outline',
  className = '',
  size = 'sm',
  showLabel = true
}) => {
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<string | null>(null);
  
  const handleSync = async () => {
    if (syncing) return;
    
    setSyncing(true);
    setSyncProgress('Սկսվում է համաժամեցումը...');
    toast.info('Տվյալների համաժամեցման գործընթացը սկսվել է...');
    
    try {
      // Start the synchronization process with progress updates
      const success = await databaseSyncService.syncAllData(
        // Progress callback
        (status: string) => {
          setSyncProgress(status);
        }
      );
      
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
      setSyncProgress(null);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <Button
        variant={variant}
        size={size}
        onClick={handleSync}
        disabled={syncing}
        className={`flex items-center gap-2 ${className}`}
        title="Համաժամեցնել տվյալները Supabase բազայի հետ"
      >
        {syncing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        {showLabel && (syncing ? 'Համաժամեցվում է...' : 'Համաժամեցնել')}
      </Button>
      
      {syncProgress && (
        <p className="text-xs text-muted-foreground mt-1">{syncProgress}</p>
      )}
    </div>
  );
};

export default DatabaseSyncButton;
