
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

// Sample projects data
const sampleProjects = [
  {
    id: 1,
    title: 'Դինամիկ վեբ կայք Node.js-ով',
    description: 'MongoDB տվյալների բազայով կայք',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JavaScript'],
    status: 'completed',
    role: 'Backend Developer',
    grade: '5.0',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project1',
    link: 'https://github.com/example/nodejs-project'
  },
  {
    id: 2,
    title: 'React հավելված',
    description: 'Single Page Application Redux-ով և TypeScript-ով',
    technologies: ['React', 'Redux', 'TypeScript', 'CSS'],
    status: 'completed',
    role: 'Frontend Developer',
    grade: '4.8',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project2',
    link: 'https://github.com/example/react-app'
  },
  {
    id: 3,
    title: 'E-commerce կայք',
    description: 'Ամբողջական ֆունկցիոնալությամբ էլեկտրոնային առևտրի կայք',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux'],
    status: 'in-progress',
    role: 'Full Stack Developer',
    grade: 'N/A',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project3',
    link: 'https://github.com/example/ecommerce'
  },
  {
    id: 4,
    title: 'Մոբայլ հավելված',
    description: 'React Native-ով մշակված մոբայլ հավելված',
    technologies: ['React Native', 'JavaScript', 'Firebase'],
    status: 'in-progress',
    role: 'Mobile Developer',
    grade: 'N/A',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project4',
    link: 'https://github.com/example/mobile-app'
  },
  {
    id: 5,
    title: 'Տվյալների վերլուծություն',
    description: 'Python-ով իրականացված տվյալների վերլուծության նախագիծ',
    technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
    status: 'completed',
    role: 'Data Analyst',
    grade: '4.7',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project5',
    link: 'https://github.com/example/data-analysis'
  }
];

// Status label mapper
const statusLabels: Record<string, { label: string, className: string }> = {
  'completed': { label: 'Ավարտված', className: 'bg-green-100 text-green-800' },
  'in-progress': { label: 'Ընթացքում', className: 'bg-blue-100 text-blue-800' },
  'pending': { label: 'Սպասման մեջ', className: 'bg-yellow-100 text-yellow-800' }
};

const ProfileProjects: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Նախագծեր</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Ֆիլտրել</Button>
            <Button size="sm">+ Նոր նախագիծ</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleProjects.map(project => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-32 bg-slate-100 flex items-center justify-center">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <span className={`text-xs px-2 py-1 rounded ${statusLabels[project.status]?.className}`}>
                    {statusLabels[project.status]?.label}
                  </span>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-2">
                  <p className="text-sm mb-1"><span className="font-medium">Դեր:</span> {project.role}</p>
                  {project.grade !== 'N/A' && (
                    <p className="text-sm mb-1"><span className="font-medium">Գնահատական:</span> {project.grade}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies.map(tech => (
                    <Badge key={tech} variant="secondary">{tech}</Badge>
                  ))}
                </div>
                <div className="mt-2">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={project.link} target="_blank" rel="noopener noreferrer">Դիտել նախագիծը</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileProjects;
