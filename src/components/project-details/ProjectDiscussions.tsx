
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils';

interface ProjectDiscussionsProps {
  projectId: number;
  isEditing?: boolean;
}

const ProjectDiscussions: React.FC<ProjectDiscussionsProps> = ({ projectId, isEditing = false }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  
  // Mock comments data
  const [comments, setComments] = useState([
    {
      id: '1',
      author: 'Արամ Հակոբյան',
      authorRole: 'ղեկավար',
      authorAvatar: '/placeholder.svg',
      content: 'Հարգելի ուսանողներ, խնդրում եմ ուշադրություն դարձնել նախագծի ժամկետներին։',
      timestamp: '2024-04-10T14:22:00Z'
    },
    {
      id: '2',
      author: 'Գագիկ Պետրոսյան',
      authorRole: 'ուսանող',
      authorAvatar: '/placeholder.svg',
      content: 'Շնորհակալություն հիշեցման համար։ Մենք աշխատում ենք նախագծի վրա և կներկայացնենք ժամանակին։',
      timestamp: '2024-04-10T15:45:00Z'
    }
  ]);
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const newCommentObj = {
      id: `${comments.length + 1}`,
      author: user?.name || 'Անանուն օգտատեր',
      authorRole: user?.role || 'հյուր',
      authorAvatar: user?.avatar || '/placeholder.svg',
      content: newComment,
      timestamp: new Date().toISOString()
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Նախագծի քննարկումներ</h2>
      </div>
      
      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="p-4 bg-muted/30 rounded-lg border border-border/30">
            <div className="flex justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                  <img 
                    src={comment.authorAvatar}
                    alt={comment.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{comment.author}</div>
                  <div className="text-xs text-muted-foreground">{comment.authorRole}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(comment.timestamp)}
              </div>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
        ))}
      </div>
      
      {!isEditing && (
        <div className="space-y-4 pt-4 border-t border-border/30">
          <Textarea
            placeholder="Գրեք ձեր մեկնաբանությունը..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="w-full"
          />
          <div className="flex justify-end">
            <Button onClick={handleAddComment}>Ուղարկել</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDiscussions;
