
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
  onSyncComplete?: () => void;
}

const DatabaseSyncButton: React.FC<DatabaseSyncButtonProps> = ({ 
  variant = 'outline',
  className = '',
  size = 'sm',
  showLabel = true,
  onSyncComplete
}) => {
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<string | null>(null);
  
  const handleSync = async () => {
    if (syncing) return;
    
    setSyncing(true);
    setSyncProgress('Սկսվում է համաժամեցումը...');
    toast.info('Տվյալների համաժամեցման գործընթացը սկսվել է...');
    
    try {
      // First try to load data from localStorage if available
      const success = await databaseSyncService.loadDataFromLocalStorage(
        // Progress callback
        (status: string) => {
          setSyncProgress(status);
        }
      );

      if (success) {
        toast.success('Տվյալները հաջողությամբ բեռնվել են լոկալ հիշողությունից');
      }
      
      // Then try to sync with the database (if it fails, we'll at least have local data)
      try {
        // Start the synchronization process with progress updates
        await databaseSyncService.syncAllData(
          // Progress callback
          (status: string) => {
            setSyncProgress(status);
          }
        );
        
        toast.success('Տվյալները հաջողությամբ համաժամեցվել են բազայի հետ');
        
        // Call the onSyncComplete callback if provided
        if (onSyncComplete) {
          onSyncComplete();
        }
      } catch (syncError) {
        console.error('Error syncing with database:', syncError);
        toast.error('Բազայի հետ համաժամեցման ժամանակ սխալ է տեղի ունեցել, լոկալ տվյալներն են օգտագործվում');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Տվյալների բեռնման ժամանակ սխալ է տեղի ունեցել');
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
