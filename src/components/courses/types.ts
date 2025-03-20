
export interface Course {
  id: string;
  name: string;
  description: string;
  specialization?: string;
  duration: string;
  modules: string[];
  createdBy: string;
}
