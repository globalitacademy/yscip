
-- Create course applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.course_applications (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  course_id UUID NOT NULL,
  course_title TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);

-- Add RLS policies
ALTER TABLE public.course_applications ENABLE ROW LEVEL SECURITY;

-- Allow admins to select all course applications
CREATE POLICY "Admins can view all course applications"
ON public.course_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow admins to insert course applications
CREATE POLICY "Admins can insert course applications"
ON public.course_applications
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow admins to update course applications
CREATE POLICY "Admins can update course applications"
ON public.course_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow anyone to insert an application (for unauthenticated users)
CREATE POLICY "Anyone can submit a course application"
ON public.course_applications
FOR INSERT
WITH CHECK (true);
