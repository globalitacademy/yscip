
import React, { createContext } from 'react';
import { CourseContextType } from '@/components/courses/types';

// Create the context with undefined as default value
export const CourseContext = createContext<CourseContextType | undefined>(undefined);
