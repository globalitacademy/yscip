
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Plus, 
  Send, 
  MoreVertical, 
  ThumbsUp, 
  Reply
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/components/ui/use-toast';
import { getCurrentUser } from '@/data/userRoles';

interface Discussion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  replies: Reply[];
  likes: string[]; // Array of user IDs who liked the discussion
}

interface Reply {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  likes: string[]; // Array of user IDs who liked the reply
}

interface ProjectDiscussionsProps {
  projectId: number;
}

const ProjectDiscussions: React.FC<ProjectDiscussionsProps> = ({ projectId }) => {
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: '1',
      title: 'Ինչպե՞ս նախագծել տվյալների կառուցվածքը',
      content: 'Ես պատրաստում եմ տվյալների բազայի սխեման և ինձ հետաքրքիր է, թե ինչպես պետք է կապել օգտատերերի և պրոյեկտների աղյուսակները։ Խնդրում եմ ուղղորդել։',
      authorId: 'student1',
      authorName: 'Գագիկ Պետրոսյան',
      authorAvatar: '/placeholder.svg',
      createdAt: new Date(2023, 5, 15),
      replies: [
        {
          id: '2',
          content: 'Կարող եք օգտագործել many-to-many կապ՝ օգտատերերի և պրոյեկտների միջև։ Սա թույլ կտա մեկ պրոյեկտին ունենալ բազմաթիվ մասնակիցներ, իսկ մեկ օգտատերը կարող է մասնակցել բազմաթիվ պրոյեկտների։',
          authorId: 'supervisor1',
          authorName: 'Արամ Հակոբյան',
          authorAvatar: '/placeholder.svg',
          createdAt: new Date(2023, 5, 16),
          likes: ['student1']
        }
      ],
      likes: []
    }
  ]);
  
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: ''
  });
  
  const [newReplies, setNewReplies] = useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const currentUser = getCurrentUser();
  
  const handleCreateDiscussion = () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) return;
    
    const discussion: Discussion = {
      id: uuidv4(),
      title: newDiscussion.title,
      content: newDiscussion.content,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      createdAt: new Date(),
      replies: [],
      likes: []
    };
    
    setDiscussions([discussion, ...discussions]);
    setNewDiscussion({ title: '', content: '' });
    setDialogOpen(false);
    toast({
      title: "Թեման ստեղծված է",
      description: "Ձեր քննարկման թեման հաջողությամբ ստեղծվել է։",
    });
  };
  
  const handleCreateReply = (discussionId: string) => {
    const replyContent = newReplies[discussionId];
    if (!replyContent?.trim()) return;
    
    const reply: Reply = {
      id: uuidv4(),
      content: replyContent,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      createdAt: new Date(),
      likes: []
    };
    
    setDiscussions(discussions.map(discussion => {
      if (discussion.id === discussionId) {
        return {
          ...discussion,
          replies: [...discussion.replies, reply]
        };
      }
      return discussion;
    }));
    
    setNewReplies({ ...newReplies, [discussionId]: '' });
    toast({
      title: "Պատասխանն ուղարկված է",
      description: "Ձեր պատասխանը հաջողությամբ ավելացվել է քննարկմանը։",
    });
  };
  
  const handleLikeDiscussion = (discussionId: string) => {
    setDiscussions(discussions.map(discussion => {
      if (discussion.id === discussionId) {
        const hasLiked = discussion.likes.includes(currentUser.id);
        
        return {
          ...discussion,
          likes: hasLiked 
            ? discussion.likes.filter(id => id !== currentUser.id) 
            : [...discussion.likes, currentUser.id]
        };
      }
      return discussion;
    }));
  };
  
  const handleLikeReply = (discussionId: string, replyId: string) => {
    setDiscussions(discussions.map(discussion => {
      if (discussion.id === discussionId) {
        const updatedReplies = discussion.replies.map(reply => {
          if (reply.id === replyId) {
            const hasLiked = reply.likes.includes(currentUser.id);
            
            return {
              ...reply,
              likes: hasLiked 
                ? reply.likes.filter(id => id !== currentUser.id) 
                : [...reply.likes, currentUser.id]
            };
          }
          return reply;
        });
        
        return {
          ...discussion,
          replies: updatedReplies
        };
      }
      return discussion;
    }));
  };
  
  const handleDeleteDiscussion = (discussionId: string) => {
    setDiscussions(discussions.filter(d => d.id !== discussionId));
    toast({
      title: "Թեման ջնջված է",
      description: "Քննարկման թեման հաջողությամբ ջնջվել է։",
    });
  };
  
  const handleDeleteReply = (discussionId: string, replyId: string) => {
    setDiscussions(discussions.map(discussion => {
      if (discussion.id === discussionId) {
        return {
          ...discussion,
          replies: discussion.replies.filter(r => r.id !== replyId)
        };
      }
      return discussion;
    }));
    toast({
      title: "Պատասխանը ջնջված է",
      description: "Պատասխանը հաջողությամբ ջնջվել է։",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Քննարկումներ</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus size={16} /> Նոր թեմա
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Ստեղծել նոր քննարկման թեմա</DialogTitle>
              <DialogDescription>
                Ստեղծեք նոր թեմա նախագծի շուրջ քննարկման համար։
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Վերնագիր</Label>
                <Input
                  id="title"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ներմուծեք թեմայի վերնագիրը"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Բովանդակություն</Label>
                <Textarea
                  id="content"
                  rows={5}
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Մանրամասն նկարագրեք ձեր հարցը կամ առաջարկը..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateDiscussion}>Ստեղծել թեմա</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {discussions.length === 0 ? (
        <Card className="p-6 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Քննարկումներ չկան</h3>
          <p className="mt-2 text-sm text-muted-foreground">Ստեղծեք առաջին քննարկման թեման՝ սկսելու համար։</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {discussions.map(discussion => (
            <Card key={discussion.id} className="p-6">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={discussion.authorAvatar} alt={discussion.authorName} />
                    <AvatarFallback>{discussion.authorName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{discussion.authorName}</h4>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(discussion.createdAt), 'dd MMM yyyy, HH:mm')}
                    </p>
                  </div>
                </div>
                
                {discussion.authorId === currentUser.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteDiscussion(discussion.id)}
                      >
                        Ջնջել
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              
              <h3 className="text-lg font-medium mt-4">{discussion.title}</h3>
              <p className="mt-2 text-muted-foreground">{discussion.content}</p>
              
              <div className="flex justify-end mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleLikeDiscussion(discussion.id)}
                  className={discussion.likes.includes(currentUser.id) ? 'text-primary' : ''}
                >
                  <ThumbsUp size={16} className="mr-1" /> 
                  {discussion.likes.length > 0 && discussion.likes.length}
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                {discussion.replies.map(reply => (
                  <div key={reply.id} className="bg-muted/30 rounded-lg p-4">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={reply.authorAvatar} alt={reply.authorName} />
                          <AvatarFallback>{reply.authorName.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h5 className="font-medium text-sm">{reply.authorName}</h5>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(reply.createdAt), 'dd MMM yyyy, HH:mm')}
                          </p>
                        </div>
                      </div>
                      
                      {reply.authorId === currentUser.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical size={14} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteReply(discussion.id, reply.id)}
                            >
                              Ջնջել
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    
                    <p className="mt-2 text-sm">{reply.content}</p>
                    
                    <div className="flex justify-end mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleLikeReply(discussion.id, reply.id)}
                        className={`h-7 ${reply.likes.includes(currentUser.id) ? 'text-primary' : ''}`}
                      >
                        <ThumbsUp size={14} className="mr-1" /> 
                        {reply.likes.length > 0 && reply.likes.length}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <Input
                  placeholder="Ավելացնել պատասխան..."
                  value={newReplies[discussion.id] || ''}
                  onChange={(e) => setNewReplies({ ...newReplies, [discussion.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleCreateReply(discussion.id);
                    }
                  }}
                  className="flex-1"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleCreateReply(discussion.id)}
                  disabled={!newReplies[discussion.id]?.trim()}
                >
                  <Send size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDiscussions;
