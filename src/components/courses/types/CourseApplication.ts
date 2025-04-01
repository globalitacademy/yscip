
export interface CourseApplication {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone_number: string;
  course_id: string;
  course_title: string;
  message?: string;
  format?: string;
  session_type?: string;
  languages?: string[];
  free_practice?: boolean;
  status: 'new' | 'contacted' | 'enrolled' | 'rejected';
}
