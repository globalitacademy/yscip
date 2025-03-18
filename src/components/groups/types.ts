
export interface Group {
  id: string;
  name: string;
  course: string;
  lecturer_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface GroupStudent {
  id: string;
  group_id: string;
  student_id: string;
  created_at?: string;
}

export interface NewGroupData {
  name: string;
  course: string;
  lecturer_id: string;
}
