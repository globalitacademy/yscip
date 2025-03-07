
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

// Sample skills data grouped by category
const skillsData = {
  'Ծրագրավորման լեզուներ': [
    { name: 'JavaScript', level: 'expert', verified: true },
    { name: 'TypeScript', level: 'intermediate', verified: true },
    { name: 'HTML/CSS', level: 'expert', verified: true },
    { name: 'Python', level: 'intermediate', verified: false },
    { name: 'Java', level: 'beginner', verified: false }
  ],
  'Շրջանակներ և գրադարաններ': [
    { name: 'React', level: 'expert', verified: true },
    { name: 'Node.js', level: 'intermediate', verified: true },
    { name: 'Express', level: 'intermediate', verified: true },
    { name: 'Redux', level: 'intermediate', verified: false },
    { name: 'Angular', level: 'beginner', verified: false }
  ],
  'Տվյալների բազաներ': [
    { name: 'MongoDB', level: 'intermediate', verified: true },
    { name: 'MySQL', level: 'intermediate', verified: true },
    { name: 'PostgreSQL', level: 'beginner', verified: false }
  ],
  'Գործիքներ և տեխնոլոգիաներ': [
    { name: 'Git', level: 'expert', verified: true },
    { name: 'Docker', level: 'beginner', verified: false },
    { name: 'AWS', level: 'beginner', verified: false },
    { name: 'Webpack', level: 'intermediate', verified: true }
  ],
  'Փափուկ հմտություններ': [
    { name: 'Թիմային աշխատանք', level: 'expert', verified: true },
    { name: 'Հաղորդակցություն', level: 'expert', verified: true },
    { name: 'Ժամանակի կառավարում', level: 'intermediate', verified: false },
    { name: 'Խնդիրների լուծում', level: 'expert', verified: true }
  ]
};

// Level mapper to Armenian
const levelLabels: Record<string, { label: string, className: string }> = {
  'beginner': { label: 'Սկսնակ', className: 'bg-blue-100 text-blue-800' },
  'intermediate': { label: 'Միջին', className: 'bg-yellow-100 text-yellow-800' },
  'expert': { label: 'Փորձառու', className: 'bg-green-100 text-green-800' }
};

const ProfileSkills: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Հմտություններ</h2>
          <div>
            <Button size="sm">+ Ավելացնել հմտություն</Button>
          </div>
        </div>
        
        {Object.entries(skillsData).map(([category, skills]) => (
          <Card key={category} className="mb-6">
            <CardHeader>
              <CardTitle>{category}</CardTitle>
              <CardDescription>
                {skills.length} հմտություն այս կատեգորիայում
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skills.map(skill => (
                  <div key={skill.name} className="flex justify-between items-center p-3 border rounded-md hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{skill.name}</span>
                      {skill.verified && (
                        <Badge variant="outline" className="bg-green-50">Հաստատված</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${levelLabels[skill.level]?.className}`}>
                        {levelLabels[skill.level]?.label}
                      </span>
                      <Button variant="ghost" size="sm">Խմբագրել</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkills;
