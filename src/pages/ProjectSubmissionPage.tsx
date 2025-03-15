import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, HardDrive, Check, X, Loader2, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import { toast } from 'sonner';
import { format } from 'date-fns';

const ProjectSubmissionPage: React.FC = () => {
  const { user } = useAuth();
  const { canSubmitProject } = useProjectPermissions(user?.role);
  
  const [activeTab, setActiveTab] = useState('new');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    githubUrl: '',
    additionalInfo: '',
  });
  const [submissions, setSubmissions] = useState([
    {
      id: '1',
      title: 'Անձնական կաբինետ',
      submittedDate: new Date(2023, 10, 15),
      status: 'pending',
      feedback: '',
    },
    {
      id: '2',
      title: 'Բազային ներկայացում',
      submittedDate: new Date(2023, 9, 20),
      status: 'approved',
      feedback: 'Լավ աշխատանք։ Շարունակեք նույն տեմպով։',
    },
    {
      id: '3',
      title: 'Նախնական առաջադրանք',
      submittedDate: new Date(2023, 8, 5),
      status: 'rejected',
      feedback: 'Անհրաժեշտ է վերանայել տեխնիկական մասնագրերը։',
    }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData.title || !projectData.description) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը։');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Add to local submissions for demo
      const newSubmission = {
        id: (submissions.length + 1).toString(),
        title: projectData.title,
        submittedDate: new Date(),
        status: 'pending',
        feedback: '',
      };
      
      setSubmissions(prev => [newSubmission, ...prev]);
      
      // Reset form
      setProjectData({
        title: '',
        description: '',
        githubUrl: '',
        additionalInfo: '',
      });
      setFiles([]);
      
      toast.success('Նախագիծը հաջողությամբ ներկայացվել է։');
      setIsSubmitting(false);
      setActiveTab('history');
    }, 1500);
  };

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

  if (!canSubmitProject) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Նախագծի տեղադրում</CardTitle>
              <CardDescription>
                Այս բաժինը հասանելի է միայն ուսանողների համար
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Info size={48} className="text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                Ձեր դերակատարումը չունի նախագծեր ներկայացնելու թույլտվություն։
              </p>
              <p className="text-sm text-muted-foreground">
                Կապվեք ձեր ղեկավարի հետ հետագա քայլերի համար։
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Նախագծի տեղադրում</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">Նոր տեղադրում</TabsTrigger>
            <TabsTrigger value="history">Ներկայացված նախագծեր</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Նոր նախագծի տեղադրում</CardTitle>
                <CardDescription>
                  Ներկայացրեք Ձեր նախագիծը ստուգման և գնահատման համար
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Նախագծի անվանումը <span className="text-red-500">*</span></Label>
                    <Input
                      id="title"
                      name="title"
                      value={projectData.title}
                      onChange={handleInputChange}
                      placeholder="Օր․՝ Տեղեկատվական համակարգ ուսանողների համար"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Նկարագրություն <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={projectData.description}
                      onChange={handleInputChange}
                      placeholder="Մանրամասն նկարագրեք Ձեր նախագիծը, նշելով հիմնական ֆունկցիոնալությունը, տեխնոլոգիաները և այլն"
                      rows={5}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub հղում</Label>
                    <Input
                      id="githubUrl"
                      name="githubUrl"
                      value={projectData.githubUrl}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username/repository"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="files">Կցել ֆայլեր</Label>
                    <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Քաշեք ֆայլերը այստեղ կամ սեղմեք ֆայլ ընտրելու համար</p>
                      <p className="text-xs text-muted-foreground mb-4">Առավելագույնը 10 MB, .pdf, .docx, .zip, .rar, .ppt</p>
                      <Input
                        id="files"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.docx,.pptx,.zip,.rar"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('files')?.click()}
                      >
                        Ընտրել ֆայլեր
                      </Button>
                    </div>
                    
                    {files.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Կցված ֆայլեր ({files.length})</h4>
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                              <div className="flex items-center">
                                <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Լրացուցիչ տեղեկություններ</Label>
                    <Textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={projectData.additionalInfo}
                      onChange={handleInputChange}
                      placeholder="Նշեք ցանկացած լրացուցիչ տեղեկություն, որը կարող է օգտակար լինել նախագծի գնահատման համար"
                      rows={3}
                    />
                  </div>
                  
                  <CardFooter className="px-0 pt-6">
                    <Button
                      type="submit"
                      className="ml-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Տեղադրվում է...
                        </>
                      ) : (
                        'Տեղադրել նախագիծը'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
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
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectSubmissionPage;
