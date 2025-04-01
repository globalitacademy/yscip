
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Eye } from 'lucide-react';

// Mock data for course applications
const applications = [
  { 
    id: '1', 
    fullName: 'Անի Հակոբյան', 
    email: 'ani@example.com', 
    course: 'Ալգորիթմների հիմունքներ', 
    date: '2023-05-15', 
    status: 'pending' 
  },
  { 
    id: '2', 
    fullName: 'Գևորգ Սարգսյան', 
    email: 'gevorg@example.com', 
    course: 'Վեբ ծրագրավորում', 
    date: '2023-05-14', 
    status: 'approved' 
  },
  { 
    id: '3', 
    fullName: 'Աննա Հարությունյան', 
    email: 'anna@example.com', 
    course: 'Տվյալների բազաներ', 
    date: '2023-05-12', 
    status: 'rejected' 
  },
  { 
    id: '4', 
    fullName: 'Արամ Պետրոսյան', 
    email: 'aram@example.com', 
    course: 'Մեքենայական ուսուցում', 
    date: '2023-05-10', 
    status: 'pending' 
  },
  { 
    id: '5', 
    fullName: 'Մարիամ Ավետիսյան', 
    email: 'mariam@example.com', 
    course: 'Արհեստական բանականություն', 
    date: '2023-05-09', 
    status: 'pending' 
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-500">Հաստատված</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Մերժված</Badge>;
    case 'pending':
    default:
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Սպասում է</Badge>;
  }
};

const ApplicationsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Դասընթացների դիմումներ</CardTitle>
        <CardDescription>Վերջին դիմումները դասընթացներին մասնակցելու համար</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Անուն</TableHead>
              <TableHead>Էլ․ փոստ</TableHead>
              <TableHead>Դասընթաց</TableHead>
              <TableHead>Ամսաթիվ</TableHead>
              <TableHead>Կարգավիճակ</TableHead>
              <TableHead className="text-right">Գործողություններ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.fullName}</TableCell>
                <TableCell>{app.email}</TableCell>
                <TableCell>{app.course}</TableCell>
                <TableCell>{app.date}</TableCell>
                <TableCell>{getStatusBadge(app.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {app.status === 'pending' && (
                      <>
                        <Button variant="outline" size="icon" className="text-green-500 hover:text-green-600 hover:bg-green-50">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ApplicationsTab;
