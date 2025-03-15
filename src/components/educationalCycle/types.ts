
import { ReactElement } from 'react';

export interface EducationalModule {
  id: number;
  title: string;
  icon: React.ElementType;
  description?: string;
  status?: 'not-started' | 'in-progress' | 'completed';
  progress?: number;
  topics?: string[];
}
