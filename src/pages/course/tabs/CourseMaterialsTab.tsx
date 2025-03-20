
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const CourseMaterialsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ուսումնական նյութեր</CardTitle>
        <CardDescription>
          Դասընթացի ուսումնական նյութերը և ռեսուրսները
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-3 text-primary" />
              <div>
                <h4 className="font-medium">Դասընթացի տեսական նյութեր</h4>
                <p className="text-sm text-muted-foreground">PDF, 2.5MB</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Ներբեռնել
            </Button>
          </div>
          
          <div className="border p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-3 text-primary" />
              <div>
                <h4 className="font-medium">Գործնական առաջադրանքներ</h4>
                <p className="text-sm text-muted-foreground">PDF, 1.8MB</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Ներբեռնել
            </Button>
          </div>
          
          <div className="border p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-3 text-primary" />
              <div>
                <h4 className="font-medium">Օգտակար հղումներ և ռեսուրսներ</h4>
                <p className="text-sm text-muted-foreground">PDF, 0.5MB</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Ներբեռնել
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseMaterialsTab;
