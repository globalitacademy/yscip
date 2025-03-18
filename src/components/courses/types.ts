
export interface Course {
  id: string;
  title: string;  // Changed from name
  description: string;
  // specialization is not in DB schema, making it optional
  specialization?: string;
  duration: string;
  modules?: string[];  // Not in DB schema, making it optional
  createdBy: string;
  color?: string;
  button_text?: string;
  icon_name?: string;
  subtitle?: string;
  price?: string;
  image_url?: string;
  institution?: string;
  is_persistent?: boolean;
}
