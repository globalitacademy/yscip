
import React from 'react';

export interface ProfessionalCourse {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactElement;
  duration: string;
  price: string;
  buttonText: string;
  color: string;
  createdBy: string;
  institution: string;
}
