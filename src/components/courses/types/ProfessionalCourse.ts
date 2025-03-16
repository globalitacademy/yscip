
import { ReactNode } from 'react';

// Interface for professional courses display
export interface ProfessionalCourse {
  id: string;
  title: string;
  subtitle: string;
  icon: string | ReactNode;
  duration: string;
  price: string;
  buttonText: string;
  color: string;
  createdBy: string;
  institution: string;
}
