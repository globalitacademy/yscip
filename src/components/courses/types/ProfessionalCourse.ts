
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
  imageUrl?: string;
  organizationLogo?: string;
  description?: string;
  lessons?: { title: string; duration: string }[];
  requirements?: string[];
  outcomes?: string[];
  iconName?: string; // Added to support storing the icon name in the database
}
