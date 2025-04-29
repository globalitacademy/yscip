
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Comment {
  id: string;
  text: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
}

interface ProjectDiscussionsProps {
  projectId: number;
  isEditing: boolean;
}

const ProjectDiscussions: React.FC<ProjectDiscussionsProps> = ({
  projectId,
  isEditing
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      text: 'Հարգելի ուսանող, պրոեկտի առաջին փուլի վերաբերյալ կան մի քանի հարցեր։ Խնդրում եմ պատասխանել դրանց մինչև հաջորդ շաբաթվա վերջը։',
      author: {
        id: 'supervisor1',
        name: 'Արամ Հակոբյան',
        avatar: '/placeholder.svg',
      },
      timestamp: '2023-05-15T10:30:00Z',
    },
    {
      id: '2',
      text: 'Շնորհակալություն հարցերի համար։ Մինչև հաջորդ շաբաթվա վերջը կուղարկեմ պատասխանները։',
      author: {
        id: 'student1',
        name: 'Գագիկ Պետրոսյան',
        avatar: '/placeholder.svg',
      },
      timestamp: '2023-05-15T14:45:00Z',
    },
  ]);
  
  const handleSendComment = () => {
    if (!newComment.trim() || !user) return;
    
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      text: newComment,
      author: {
        id: user.id,
        name: user.name || 'Օգտատեր',
        avatar: user.avatar || undefined,
      },
      timestamp: new Date().toISOString(),
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" /> Քննարկումներ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar>
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{comment.author.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.timestamp), 'dd.MM.yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="mt-1">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="mt-6 space-y-2">
          <Textarea
            placeholder="Գրեք ձեր մեկնաբանությունը..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={handleSendComment}>
              <Send className="h-4 w-4 mr-2" /> Ուղարկել
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDiscussions;
