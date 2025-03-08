
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Sparkles } from 'lucide-react';

const StudentProjects: React.FC = () => {
  const projects = [
    {
      id: '1',
      title: 'Առցանց ուսուցման համակարգ',
      description: 'Մշակել առցանց ուսուցման համակարգ, որը թույլ կտա ուսանողներին մասնակցել դասընթացներին, կատարել առաջադրանքներ և ստանալ գնահատականներ։',
      skills: ['React', 'Node.js', 'MongoDB'],
      deadline: '2024-06-15',
      status: 'available'
    },
    {
      id: '2',
      title: 'Մոբայլ հավելված գրադարանների համար',
      description: 'Ստեղծել մոբայլ հավելված, որը թույլ կտա օգտագործողներին փնտրել գրքեր, պատվիրել դրանք և ստանալ ծանուցումներ վերադարձի ժամկետների մասին։',
      skills: ['React Native', 'Firebase', 'Redux'],
      deadline: '2024-07-20',
      status: 'reserved'
    },
    {
      id: '3',
      title: 'Ընկերային ցանց նախասիրությունների համար',
      description: 'Մշակել ընկերային ցանց, որտեղ օգտագործողները կարող են հավաքվել ըստ իրենց նախասիրությունների և կիսվել գաղափարներով։',
      skills: ['Angular', 'Express', 'PostgreSQL'],
      deadline: '2024-08-10',
      status: 'available'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Հասանելի</Badge>;
      case 'reserved':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Ամրագրված</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Ավարտված</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Հասանելի նախագծեր</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="p-6 h-full flex flex-col">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="font-semibold text-lg">{project.title}</h3>
              {getStatusBadge(project.status)}
            </div>
            
            <p className="text-gray-600 mb-4 flex-grow">{project.description}</p>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-slate-100">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-1" />
                <span>Վերջնաժամկետ՝ {new Date(project.deadline).toLocaleDateString('hy-AM')}</span>
              </div>
              
              <div className="pt-4">
                {project.status === 'available' ? (
                  <Button className="w-full">
                    <Sparkles size={16} className="mr-2" />
                    Ամրագրել
                  </Button>
                ) : project.status === 'reserved' ? (
                  <Button variant="outline" className="w-full" disabled>
                    <Check size={16} className="mr-2" />
                    Ամրագրված
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    <Check size={16} className="mr-2" />
                    Ավարտված
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentProjects;
