
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const ProjectEmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">Նախագծեր չեն գտնվել</p>
      <Button className="mt-4">
        <PlusCircle className="mr-2 h-4 w-4" />
        Ավելացնել նոր նախագիծ
      </Button>
    </div>
  );
};

export default ProjectEmptyState;
