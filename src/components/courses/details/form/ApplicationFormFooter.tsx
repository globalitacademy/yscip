
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ApplicationFormFooterProps {
  loading: boolean;
  onClose: () => void;
}

const ApplicationFormFooter: React.FC<ApplicationFormFooterProps> = ({ 
  loading, onClose 
}) => {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onClose}>
        Չեղարկել
      </Button>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Ուղարկել հայտ
      </Button>
    </DialogFooter>
  );
};

export default ApplicationFormFooter;
