
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderKanban, GraduationCap, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const StatCards: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Օգտատերեր</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,254</div>
          <p className="text-xs text-muted-foreground">+12.5% քան նախորդ ամիս</p>
        </CardContent>
        <CardFooter className="p-2">
          <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/users')}>
            Դիտել բոլորը
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Նախագծեր</CardTitle>
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">432</div>
          <p className="text-xs text-muted-foreground">+5.2% քան նախորդ ամիս</p>
        </CardContent>
        <CardFooter className="p-2">
          <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/admin-projects')}>
            Դիտել բոլորը
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Դասընթացներ</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">128</div>
          <p className="text-xs text-muted-foreground">+8.1% քան նախորդ ամիս</p>
        </CardContent>
        <CardFooter className="p-2">
          <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/courses')}>
            Դիտել բոլորը
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Կազմակերպություններ</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85</div>
          <p className="text-xs text-muted-foreground">+3.7% քան նախորդ ամիս</p>
        </CardContent>
        <CardFooter className="p-2">
          <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/organizations')}>
            Դիտել բոլորը
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StatCards;
