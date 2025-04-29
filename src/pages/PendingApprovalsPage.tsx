
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  MousePointerClick, 
  Check, 
  X, 
  Eye, 
  AlertTriangle,
  CalendarDays 
} from 'lucide-react';
import { toast } from 'sonner';

const PendingApprovalsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  
  if (!user || (user.role !== 'supervisor' && user.role !== 'project_manager')) {
    return <Navigate to="/login" />;
  }

  // Mock requests data
  const requests = [
    {
      id: '1',
      title: 'Արհեստական բանականությամբ հիմնված առողջապահական համակարգ',
      description: 'Մշակել արհեստական բանականության վրա հիմնված համակարգ, որը կանխատեսում է հիվանդությունների ռիսկը հիմնվելով պացիենտի տվյալների վրա։',
      student: {
        id: 's1',
        name: 'Արամ Պողոսյան',
        email: 'aram.poghosyan@example.com',
        avatar: '',
        group: 'ՏՏ-301',
        year: 3
      },
      submitDate: '2024-05-01T14:30:00',
      category: 'Արհեստական բանականություն',
      keywords: ['AI', 'Machine Learning', 'Healthcare', 'Prediction']
    },
    {
      id: '2',
      title: 'Խելացի տան ավտոմատացման համակարգ',
      description: 'Մշակել IoT սարքերի համակարգ՝ տան ավտոմատացման համար, ներառյալ լուսավորության, ջերմաստիճանի և անվտանգության կառավարում։',
      student: {
        id: 's2',
        name: 'Մարիամ Սարգսյան',
        email: 'mariam.sargsyan@example.com',
        avatar: '',
        group: 'ՏՏ-302',
        year: 3
      },
      submitDate: '2024-05-02T10:15:00',
      category: 'IoT համակարգեր',
      keywords: ['IoT', 'Smart Home', 'Automation', 'Embedded Systems']
    },
    {
      id: '3',
      title: 'Կիբերանվտանգության ռիսկերի վերլուծության գործիք',
      description: 'Մշակել համակարգչային ցանցերի խոցելիության սկանավորման և ռիսկերի գնահատման գործիք։',
      student: {
        id: 's3',
        name: 'Դավիթ Մարտիրոսյան',
        email: 'davit.martirosyan@example.com',
        avatar: '',
        group: 'ՏՏ-301',
        year: 3
      },
      submitDate: '2024-05-03T16:45:00',
      category: 'Կիբերանվտանգություն',
      keywords: ['Security', 'Network', 'Vulnerability', 'Risk Assessment']
    }
  ];

  const filteredRequests = requests.filter(request => 
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleApprove = (requestId: string) => {
    toast.success('Հարցումը հաստատվեց հաջողությամբ։', {
      description: 'Ուսանողը կտեղեկացվի հարցման հաստատման մասին։'
    });
  };

  const openRejectDialog = (request: any) => {
    setSelectedRequest(request);
    setShowRejectDialog(true);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Խնդրում ենք նշել մերժման պատճառը։');
      return;
    }
    
    toast.success('Հարցումը մերժվեց։', {
      description: 'Ուսանողը կտեղեկացվի հարցման մերժման մասին։'
    });
    
    setShowRejectDialog(false);
    setRejectReason('');
    setSelectedRequest(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hy-AM', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(n => n[0])
      .join('');
  };

  const cardClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : '';
  const dialogClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : '';
  const alertClass = theme === 'dark' ? 'border-amber-800/50 bg-amber-900/20 text-amber-300' : '';

  return (
    <AdminLayout pageTitle="Թեմաների հարցումներ">
      <Card className={`animate-fade-in ${cardClass}`}>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Թեմաների հարցումներ</CardTitle>
              <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                Ուսանողների կողմից ուղարկված թեմաների հարցումներ
              </CardDescription>
            </div>
            <Badge variant="outline" className={theme === 'dark' ? 'bg-amber-900/30 text-amber-300 border-amber-700/50' : 'bg-amber-50 text-amber-800 border-amber-200'}>
              {requests.length} սպասող հարցում
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Փնտրել հարցումներ..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id} className={`overflow-hidden ${theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <CardTitle>{request.title}</CardTitle>
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDate(request.submitDate)}
                          </span>
                        </div>
                      </div>
                      <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                        {request.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-2">
                      <div className="flex flex-col sm:flex-row gap-6 justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={request.student.avatar} alt={request.student.name} />
                            <AvatarFallback className={theme === 'dark' ? 'bg-gray-700 text-gray-200' : ''}>
                              {getInitials(request.student.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{request.student.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {request.student.group} • {request.student.year}-րդ կուրս
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary" className={theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : ''}>
                            {request.category}
                          </Badge>
                          {request.keywords.slice(0, 2).map((keyword, idx) => (
                            <Badge key={idx} variant="outline" className={theme === 'dark' ? 'border-gray-700' : ''}>
                              {keyword}
                            </Badge>
                          ))}
                          {request.keywords.length > 2 && (
                            <Badge variant="outline" className={theme === 'dark' ? 'border-gray-700' : ''}>
                              +{request.keywords.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className={`flex flex-wrap gap-2 justify-end ${theme === 'dark' ? 'border-t border-gray-700' : 'border-t'}`}>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className={theme === 'dark' ? 'hover:bg-gray-700 border-gray-600' : ''}>
                            <Eye className="h-4 w-4 mr-1" /> Դիտել
                          </Button>
                        </DialogTrigger>
                        <DialogContent className={dialogClass}>
                          <DialogHeader>
                            <DialogTitle>{request.title}</DialogTitle>
                            <DialogDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                              Ուսանող՝ {request.student.name} • {formatDate(request.submitDate)}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="py-4 space-y-4">
                            <div>
                              <h4 className="font-medium mb-1">Նկարագրություն</h4>
                              <p className="text-sm text-muted-foreground">{request.description}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Կատեգորիա</h4>
                              <Badge variant="secondary" className={theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : ''}>
                                {request.category}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Բանալի բառեր</h4>
                              <div className="flex flex-wrap gap-2">
                                {request.keywords.map((keyword, idx) => (
                                  <Badge key={idx} variant="outline" className={theme === 'dark' ? 'border-gray-700' : ''}>
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Ուսանողի մասին</h4>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={request.student.avatar} alt={request.student.name} />
                                  <AvatarFallback className={theme === 'dark' ? 'bg-gray-700 text-gray-200' : ''}>
                                    {getInitials(request.student.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{request.student.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {request.student.email}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {request.student.group} • {request.student.year}-րդ կուրս
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <DialogFooter className="flex gap-2 justify-end">
                            <DialogClose asChild>
                              <Button variant="outline" className={theme === 'dark' ? 'hover:bg-gray-700 border-gray-600' : ''}>
                                Փակել
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        className={`${theme === 'dark' 
                          ? 'bg-green-900/20 text-green-400 border-green-700/50 hover:bg-green-900/40' 
                          : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Հաստատել
                      </Button>
                      
                      <Button
                        variant="outline"
                        className={`${theme === 'dark' 
                          ? 'bg-red-900/20 text-red-400 border-red-700/50 hover:bg-red-900/40' 
                          : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}
                        size="sm"
                        onClick={() => openRejectDialog(request)}
                      >
                        <X className="h-4 w-4 mr-1" /> Մերժել
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className={`flex flex-col items-center justify-center py-12 text-center rounded-md border ${theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-muted-foreground'}`}>
                <MousePointerClick className="h-12 w-12 mb-4 opacity-20" />
                <h3 className="text-lg font-medium">Հարցումներ չեն գտնվել</h3>
                <p className="text-sm mt-1 max-w-sm">
                  Այս պահին չկան ուսանողների կողմից ուղարկված հարցումներ կամ ոչ մեկը չի համապատասխանում ձեր որոնման պարամետրերին։
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className={dialogClass}>
          <DialogHeader>
            <DialogTitle>Մերժել հարցումը</DialogTitle>
            <DialogDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
              {selectedRequest && `"${selectedRequest.title}" հարցումը կմերժվի։`}
            </DialogDescription>
          </DialogHeader>
          
          <Alert className={alertClass}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Ուշադրություն</AlertTitle>
            <AlertDescription>
              Խնդրում ենք նշել մերժման պատճառը, որպեսզի ուսանողը կարողանա բարելավել իր առաջարկը։
            </AlertDescription>
          </Alert>
          
          <div className="py-4">
            <div className="space-y-2">
              <label htmlFor="reason" className="font-medium">
                Մերժման պատճառ
              </label>
              <Textarea
                id="reason"
                placeholder="Նշեք, թե ինչու եք մերժում այս հարցումը..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className={theme === 'dark' ? 'bg-gray-900 border-gray-700' : ''}
              />
            </div>
          </div>
          
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} className={theme === 'dark' ? 'hover:bg-gray-700 border-gray-600' : ''}>
              Չեղարկել
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Մերժել հարցումը
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PendingApprovalsPage;
