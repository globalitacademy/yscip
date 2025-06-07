
import React from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminCourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Կուրսի մանրամասներ</h1>
        <Card>
          <CardHeader>
            <CardTitle>Կուրս ID: {id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Այս էջը զարգանալու կարիք ունի:</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCourseDetail;
