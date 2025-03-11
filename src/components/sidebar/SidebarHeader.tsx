
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SidebarHeaderProps {
  title: string;
  onCloseMenu?: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ title, onCloseMenu }) => {
  return (
    <div className="flex justify-between items-center mb-8 px-2">
      <div className="text-xl font-bold">{title}</div>
      {onCloseMenu && (
        <Button variant="ghost" size="icon" onClick={onCloseMenu} className="md:hidden">
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default SidebarHeader;
