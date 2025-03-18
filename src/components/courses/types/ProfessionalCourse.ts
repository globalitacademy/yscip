
import React from 'react';

export interface ProfessionalCourse {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactElement;
  icon_name: string; // Added to store the icon name in the database
  duration: string;
  price: string;
  button_text: string;
  color: string;
  created_by: string;
  institution: string;
  image_url?: string;
  description?: string;
  is_persistent?: boolean; // Added to track if course is stored in database
  lessons?: { title: string; duration: string; id?: string }[];
  requirements?: string[];
  outcomes?: string[];
  created_at?: string;
  updated_at?: string;
}
