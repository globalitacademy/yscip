
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, GlobeLock, Globe, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActionButtonsProps {
  courseId: string;
  isPublic: boolean;
  canModify: boolean;
  onStatusToggle: () => void;
  onDeleteClick: () => void;
  isLoadingStatus: boolean;
  actionType: 'delete' | 'status' | null;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  courseId,
  isPublic,
  canModify,
  onStatusToggle,
  onDeleteClick,
  isLoadingStatus,
  actionType
}) => {
  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/admin/courses/${courseId}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Դիտել</p>
          </TooltipContent>
        </Tooltip>

        {canModify && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/admin/courses/${courseId}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Խմբագրել</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onStatusToggle} 
                  disabled={isLoadingStatus}
                >
                  {actionType === 'status' && isLoadingStatus ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isPublic ? (
                    <GlobeLock className="h-4 w-4" />
                  ) : (
                    <Globe className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isPublic ? 'Հանել հրապարակումից' : 'Հրապարակել'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onDeleteClick}
                  disabled={isLoadingStatus}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ջնջել</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </TooltipProvider>
    </div>
  );
};
