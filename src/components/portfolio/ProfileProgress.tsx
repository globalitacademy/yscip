
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

// Sample data for charts
const gradesByCourse = [
  { name: 'Ծրագրավորման հիմունքներ', grade: 5.0 },
  { name: 'Վեբ ծրագրավորում', grade: 4.8 },
  { name: 'Տվյալների կառուցվածքներ', grade: 4.5 },
  { name: 'Ալգորիթմներ', grade: 4.3 },
  { name: 'Տվյալների բազաներ', grade: 4.9 },
  { name: 'Մոբայլ հավելվածներ', grade: 4.7 }
];

const progressOverTime = [
  { month: 'Հնվ', completed: 2, inProgress: 0 },
  { month: 'Փտր', completed: 3, inProgress: 1 },
  { month: 'Մրտ', completed: 3, inProgress: 2 },
  { month: 'Ապր', completed: 4, inProgress: 2 },
  { month: 'Մյս', completed: 5, inProgress: 3 },
  { month: 'Հնս', completed: 6, inProgress: 2 }
];

const completionStats = [
  { name: 'Ժամանակին', value: 85 },
  { name: 'Ուշացած', value: 12 },
  { name: 'Չավարտված', value: 3 }
];

const ProfileProgress: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Առաջադիմություն</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Ավարտված նախագծեր</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">6</div>
              <p className="text-sm text-gray-500">Ընդհանուրից 9</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Միջին գնահատական</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">4.7</div>
              <p className="text-sm text-gray-500">5.0-ից</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Ժամանակին ավարտած</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">85%</div>
              <p className="text-sm text-gray-500">Ընդհանուր ավարտածների մեջ</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Գնահատականներն ըստ առարկաների</CardTitle>
              <CardDescription>Միջին գնահատականները յուրաքանչյուր առարկայի համար</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={gradesByCourse}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={70} />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="grade" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Նախագծերի քանակն ըստ ամիսների</CardTitle>
              <CardDescription>Ավարտված և ընթացիկ նախագծերի քանակը</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressOverTime}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completed" stroke="#8884d8" activeDot={{ r: 8 }} name="Ավարտված" />
                    <Line type="monotone" dataKey="inProgress" stroke="#82ca9d" name="Ընթացքում" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileProgress;
