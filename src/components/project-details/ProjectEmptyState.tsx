
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FilePlus, FileQuestion, Inbox, File } from 'lucide-react';

interface ProjectEmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const ProjectEmptyState: React.FC<ProjectEmptyStateProps> = ({
  title = "Տվյալներ չեն գտնվել",
  description = "Այս բաժնում դեռևս տվյալներ չկան",
  icon = <FileQuestion className="h-12 w-12 text-muted-foreground" />,
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/40 border border-dashed rounded-lg",
      className
    )}>
      {icon}
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      
      {actionLabel && onAction && (
        <Button 
          variant="outline" 
          onClick={onAction} 
          className="mt-4"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// Predefined empty states
export const FilesEmptyState: React.FC<Omit<ProjectEmptyStateProps, 'icon' | 'title' | 'description'>> = (props) => (
  <ProjectEmptyState
    icon={<File className="h-12 w-12 text-muted-foreground" />}
    title="Ֆայլեր չկան"
    description="Այս նախագծի համար դեռևս ֆայլեր չեն ներբեռնվել"
    {...props}
  />
);

export const DiscussionsEmptyState: React.FC<Omit<ProjectEmptyStateProps, 'icon' | 'title' | 'description'>> = (props) => (
  <ProjectEmptyState
    icon={<Inbox className="h-12 w-12 text-muted-foreground" />}
    title="Քննարկումներ չկան"
    description="Այս նախագծի համար դեռևս քննարկումներ չկան։ Սկսեք առաջին քննարկումը։"
    {...props}
  />
);

export default ProjectEmptyState;
