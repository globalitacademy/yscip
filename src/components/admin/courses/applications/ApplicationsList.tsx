
import React, { useEffect } from 'react';
import { CourseApplication } from '@/components/courses/types/CourseApplication';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, Eye, Check, X, Phone, RefreshCw, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseApplications } from '@/hooks/useCourseApplications';

const ApplicationsList: React.FC = () => {
  const { user } = useAuth();
  const { 
    applications, 
    loading, 
    fetchApplications,
    updateApplicationStatus 
  } = useCourseApplications();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Նոր</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Կապ հաստատված</Badge>;
      case 'enrolled':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Գրանցված</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Մերժված</Badge>;
      default:
        return <Badge variant="outline">Անհայտ</Badge>;
    }
  };

  const handleViewDetails = (application: CourseApplication) => {
    toast.info(
      <div>
        <h3 className="font-bold mb-2">{application.full_name}</h3>
        <p className="mb-1">Դասընթաց: {application.course_title}</p>
        <p className="mb-1">Հեռ: {application.phone_number}</p>
        <p className="mb-1">Էլ.փոստ: {application.email}</p>
        {application.format && (
          <p className="mb-1">Ձևաչափ: {application.format === 'online' ? 'Առցանց' : 'Առկա'}</p>
        )}
        {application.session_type && (
          <p className="mb-1">Դասի տեսակ: {application.session_type === 'group' ? 'Խմբային' : 'Անհատական'}</p>
        )}
        {application.languages && application.languages.length > 0 && (
          <p className="mb-1">Լեզուներ: {application.languages.map(lang => {
            switch(lang) {
              case 'armenian': return 'Հայերեն';
              case 'russian': return 'Ռուսերեն';
              case 'english': return 'Անգլերեն';
              default: return lang;
            }
          }).join(', ')}</p>
        )}
        {application.message && (
          <div className="mt-2 border-t pt-2">
            <p className="font-medium mb-1">Հաղորդագրություն:</p>
            <p>{application.message}</p>
          </div>
        )}
      </div>,
      {
        duration: 10000,
        icon: <Info className="h-5 w-5 text-blue-500" />
      }
    );
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium">Մուտքը սահմանափակված է</h3>
        <p className="text-muted-foreground mt-2">
          Այս էջը հասանելի է միայն ադմինիստրատորների համար
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Դասընթացների դիմումներ</h2>
        <Button onClick={fetchApplications} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Թարմացնել
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-muted-foreground">Դեռևս դիմումներ չկան</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ամսաթիվ</TableHead>
                <TableHead>Անուն</TableHead>
                <TableHead>Դասընթաց</TableHead>
                <TableHead>Կոնտակտներ</TableHead>
                <TableHead>Նախընտրություններ</TableHead>
                <TableHead>Կարգավիճակ</TableHead>
                <TableHead className="text-right">Գործողություններ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {new Date(application.created_at).toLocaleDateString('hy-AM')}
                  </TableCell>
                  <TableCell>{application.full_name}</TableCell>
                  <TableCell>{application.course_title}</TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{application.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Phone className="h-3 w-3" />
                        <span>{application.phone_number}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      <div>Ձևաչափ: {application.format === 'online' ? 'Առցանց' : 'Առկա'}</div>
                      <div>Դասի տեսակ: {application.session_type === 'group' ? 'Խմբային' : 'Անհատական'}</div>
                      {application.languages && application.languages.length > 0 && (
                        <div>Լեզուներ: {application.languages.length}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(application)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {application.status !== 'contacted' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateApplicationStatus(application.id, 'contacted')}
                        >
                          Կապ հաստատված
                        </Button>
                      )}
                      {application.status !== 'enrolled' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => updateApplicationStatus(application.id, 'enrolled')}
                        >
                          <Check className="h-4 w-4 mr-1" /> Գրանցել
                        </Button>
                      )}
                      {application.status !== 'rejected' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        >
                          <X className="h-4 w-4 mr-1" /> Մերժել
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
