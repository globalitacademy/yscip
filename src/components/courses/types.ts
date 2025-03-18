
export interface Course {
  id: string;
  title: string;
  description: string;
  specialization?: string;
  duration: string;
  modules?: string[];
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
