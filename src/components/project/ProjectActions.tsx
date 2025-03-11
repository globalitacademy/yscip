
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectActionsProps {
  hasMore: boolean;
  onLoadMore: () => void;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ hasMore, onLoadMore }) => {
  return (
    <div className="flex justify-center space-x-4 mt-8">
      {hasMore && (
        <Button onClick={onLoadMore} variant="outline" size="lg">
          Տեսնել ավելին
        </Button>
      )}
      
      <Link to="/">
        <Button variant="default" size="lg" className="group">
          Բոլոր թեմաները
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  );
};

export default ProjectActions;
