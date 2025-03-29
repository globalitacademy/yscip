
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SyncIcon, Loader2 } from 'lucide-react';
import { syncLocalCoursesToDatabase } from '@/utils/syncUtils';
import { toast } from 'sonner';

interface DatabaseSyncButtonProps {
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  onSyncComplete?: () => void;
}

const DatabaseSyncButton: React.FC<DatabaseSyncButtonProps> = ({
  size = 'sm',
  showLabel = false,
  onSyncComplete
}) => {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    if (syncing) return;
    
    setSyncing(true);
    try {
      // Check if there are any local courses to sync
      const localCoursesJson = localStorage.getItem('professional_courses');
      
      if (!localCoursesJson || JSON.parse(localCoursesJson).length === 0) {
        toast.info('Համաժամեցման համար լոկալ տվյալներ չկան։');
        return;
      }
      
      const result = await syncLocalCoursesToDatabase();
      
      if (result) {
        if (onSyncComplete) {
          onSyncComplete();
        }
      }
    } catch (error) {
      console.error('Error during sync:', error);
      toast.error('Համաժամեցման ընթացքում սխալ է տեղի ունեցել։');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size={size} 
      onClick={handleSync} 
      disabled={syncing}
      className="gap-2"
    >
      {syncing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <SyncIcon className="h-4 w-4" />
      )}
      {showLabel && (syncing ? 'Համաժամեցում...' : 'Համաժամեցնել')}
    </Button>
  );
};

export default DatabaseSyncButton;
