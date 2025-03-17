
import { ReactElement } from 'react';

export interface ProfessionalCourse {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactElement;
  duration: string;
  price: string;
  buttonText: string;
  color: string;
  createdBy: string;
  institution: string;
  imageUrl?: string;
  description?: string;
  isPersistent?: boolean;
  lessons?: { title: string; duration: string }[];
  requirements?: string[];
  outcomes?: string[];
}
