
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User } from '@/data/userRoles';

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<Partial<User>>({
    name: '',
    email: '',
    department: '',
    course: '',
    group: '',
    avatar: '',
    bio: ''
  });
  
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
        course: user.course || '',
        group: user.group || '',
        avatar: user.avatar || '',
        bio: user.bio || ''
      });
    }
  }, [user, isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const generateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    setProfileData(prev => ({
      ...prev,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`
    }));
  };
  
  const handleSave = () => {
    // In a real application, this would save to the backend
    // For now, we'll just show a toast message
    toast.success("Պրոֆիլը հաջողությամբ թարմացվել է");
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Պրոֆիլի խմբագրում</DialogTitle>
          <DialogDescription>
            Թարմացրեք Ձեր պրոֆիլի տեղեկատվությունը
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={profileData.avatar} alt={profileData.name} />
              <AvatarFallback>{profileData.name?.substring(0, 2).toUpperCase() || 'UN'}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={generateRandomAvatar}>
              Ստեղծել պատահական ավատար
            </Button>
          </div>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Անուն Ազգանուն</Label>
              <Input
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                placeholder="Օր.՝ Արմեն Հարությունյան"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Էլեկտրոնային հասցե</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                disabled
              />
              <p className="text-sm text-gray-500">Էլեկտրոնային հասցեն հնարավոր չէ փոփոխել</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bio">Կարճ նկարագրություն</Label>
              <Textarea
                id="bio"
                name="bio"
                value={profileData.bio || ''}
                onChange={handleChange}
                placeholder="Պատմեք Ձեր մասին, Ձեր հետաքրքրությունների և նպատակների մասին"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Ֆակուլտետ</Label>
                <Input
                  id="department"
                  name="department"
                  value={profileData.department}
                  onChange={handleChange}
                  placeholder="Օր.՝ Ինֆորմատիկայի ֆակուլտետ"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="course">Կուրս</Label>
                <Input
                  id="course"
                  name="course"
                  value={profileData.course}
                  onChange={handleChange}
                  placeholder="Օր.՝ 3"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="group">Խումբ</Label>
                <Input
                  id="group"
                  name="group"
                  value={profileData.group}
                  onChange={handleChange}
                  placeholder="Օր.՝ ԿՄ-021"
                />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Չեղարկել</Button>
          <Button onClick={handleSave}>Պահպանել</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditor;
