
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface ProjectFormFooterProps {
  onSubmit: () => void;
}

const ProjectFormFooter: React.FC<ProjectFormFooterProps> = ({ onSubmit }) => {
  return (
    <CardFooter className="flex justify-end">
      <Button variant="default" onClick={onSubmit}>
        Ստեղծել պրոեկտը
      </Button>
    </CardFooter>
  );
};

export default ProjectFormFooter;
