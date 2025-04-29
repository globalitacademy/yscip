
import React, { useState } from 'react';
import { 
  Plus, 
  MessageCircle, 
  FileText, 
  Share2, 
  Calendar, 
  UserPlus, 
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick, color }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full",
        "text-white transition-all duration-200",
        "hover:translate-y-[-2px]",
        color
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { project } = useProject();

  if (!user || !project) return null;

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const handleAddDiscussion = () => {
    toast.success('Քննարկում ավելացնելու համակարգը շուտով հասանելի կլինի');
    setIsOpen(false);
  };

  const handleUploadFile = () => {
    toast.success('Ֆայլ վերբեռնելու համակարգը շուտով հասանելի կլինի');
    setIsOpen(false);
  };

  const handleShare = () => {
    // Copy URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    toast.success('Հղումը պատճենված է');
    setIsOpen(false);
  };

  const handleAddEvent = () => {
    toast.success('Իրադարձություն ավելացնելու համակարգը շուտով հասանելի կլինի');
    setIsOpen(false);
  };

  const handleInvite = () => {
    toast.success('Հրավիրելու համակարգը շուտով հասանելի կլինի');
    setIsOpen(false);
  };

  // Որոշենք թե ինչ գործողություններ ցուցադրել կախված օգտատիրոջ դերից
  const actions: ActionButtonProps[] = [];

  // Բոլոր օգտատերերը կարող են կիսվել
  actions.push({
    icon: <Share2 size={16} />,
    label: 'Կիսվել',
    onClick: handleShare,
    color: 'bg-purple-600 hover:bg-purple-700'
  });

  // Ղեկավարներ, դասախոսներ, ադմիններ և գործատուները կարող են ֆայլեր ավելացնել
  if (['supervisor', 'lecturer', 'admin', 'employer', 'project_manager'].includes(user.role)) {
    actions.push({
      icon: <FileText size={16} />,
      label: 'Ավելացնել ֆայլ',
      onClick: handleUploadFile,
      color: 'bg-blue-600 hover:bg-blue-700'
    });
  }

  // Բոլորը կարող են քննարկումներ ավելացնել
  actions.push({
    icon: <MessageCircle size={16} />,
    label: 'Նոր քննարկում',
    onClick: handleAddDiscussion,
    color: 'bg-emerald-600 hover:bg-emerald-700'
  });

  // Ղեկավարներ, դասախոսներ և ադմինները կարող են միջոցառումներ ավելացնել
  if (['supervisor', 'lecturer', 'admin', 'project_manager'].includes(user.role)) {
    actions.push({
      icon: <Calendar size={16} />,
      label: 'Ավելացնել իրադարձություն',
      onClick: handleAddEvent,
      color: 'bg-amber-600 hover:bg-amber-700'
    });
  }

  // Ղեկավարներ, դասախոսներ և ադմինները կարող են հրավիրել
  if (['supervisor', 'lecturer', 'admin', 'project_manager'].includes(user.role)) {
    actions.push({
      icon: <UserPlus size={16} />,
      label: 'Հրավիրել',
      onClick: handleInvite,
      color: 'bg-red-600 hover:bg-red-700'
    });
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 flex flex-col gap-2 items-end transition-all duration-300">
          {actions.map((action, index) => (
            <div 
              key={index}
              className="transform transition-all duration-300"
              style={{ 
                opacity: isOpen ? 1 : 0,
                transform: `translateY(${isOpen ? 0 : 20}px)`,
                transitionDelay: `${index * 50}ms`
              }}
            >
              <ActionButton {...action} />
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={toggleMenu}
        className={cn(
          "w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg",
          "transition-all duration-300 transform",
          isOpen ? "bg-red-500 hover:bg-red-600 rotate-45" : "bg-primary hover:bg-primary/90"
        )}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
};

export default FloatingActionButton;
