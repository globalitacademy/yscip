
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Submission {
  id: string;
  title: string;
  submittedDate: Date;
  status: string;
  feedback: string;
}

interface SubmissionHistoryProps {
  submissions: Submission[];
}

const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({ submissions }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Սպասման մեջ</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Հաստատված</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Մերժված</Badge>;
      default:
        return <Badge variant="outline">Անհայտ</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ներկայացված նախագծեր</CardTitle>
        <CardDescription>
          Ձեր ներկայացրած բոլոր նախագծերը և դրանց կարգավիճակները
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Դուք դեռ չեք ներկայացրել որևէ նախագիծ
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h3 className="font-medium">{submission.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Ներկայացվել է {format(submission.submittedDate, 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(submission.status)}
                    <Button variant="outline" size="sm">Դիտել</Button>
                  </div>
                </div>
                
                {submission.feedback && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium mb-1">Կարծիք</p>
                    <p className="text-sm">{submission.feedback}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubmissionHistory;
