
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { Plus, Pencil, X } from 'lucide-react';

// Sample skills data grouped by category
const initialSkillsData = {
  'Ծրագրավորման լեզուներ': [
    { name: 'JavaScript', level: 'expert', verified: true },
    { name: 'TypeScript', level: 'intermediate', verified: true },
    { name: 'HTML/CSS', level: 'expert', verified: true },
    { name: 'Python', level: 'intermediate', verified: false },
    { name: 'Java', level: 'beginner', verified: false }
  ],
  'Շրջանակներ և գրադարաններ': [
    { name: 'React', level: 'expert', verified: true },
    { name: 'Node.js', level: 'intermediate', verified: true },
    { name: 'Express', level: 'intermediate', verified: true },
    { name: 'Redux', level: 'intermediate', verified: false },
    { name: 'Angular', level: 'beginner', verified: false }
  ],
  'Տվյալների բազաներ': [
    { name: 'MongoDB', level: 'intermediate', verified: true },
    { name: 'MySQL', level: 'intermediate', verified: true },
    { name: 'PostgreSQL', level: 'beginner', verified: false }
  ],
  'Գործիքներ և տեխնոլոգիաներ': [
    { name: 'Git', level: 'expert', verified: true },
    { name: 'Docker', level: 'beginner', verified: false },
    { name: 'AWS', level: 'beginner', verified: false },
    { name: 'Webpack', level: 'intermediate', verified: true }
  ],
  'Փափուկ հմտություններ': [
    { name: 'Թիմային աշխատանք', level: 'expert', verified: true },
    { name: 'Հաղորդակցություն', level: 'expert', verified: true },
    { name: 'Ժամանակի կառավարում', level: 'intermediate', verified: false },
    { name: 'Խնդիրների լուծում', level: 'expert', verified: true }
  ]
};

// Level mapper to Armenian
const levelLabels: Record<string, { label: string, className: string }> = {
  'beginner': { label: 'Սկսնակ', className: 'bg-blue-100 text-blue-800' },
  'intermediate': { label: 'Միջին', className: 'bg-yellow-100 text-yellow-800' },
  'expert': { label: 'Փորձառու', className: 'bg-green-100 text-green-800' }
};

// Available categories
const availableCategories = [
  'Ծրագրավորման լեզուներ',
  'Շրջանակներ և գրադարաններ',
  'Տվյալների բազաներ',
  'Գործիքներ և տեխնոլոգիաներ',
  'Փափուկ հմտություններ',
  'Այլ հմտություններ'
];

interface Skill {
  name: string;
  level: string;
  verified: boolean;
}

type SkillsData = Record<string, Skill[]>;

const ProfileSkills: React.FC = () => {
  const { user } = useAuth();
  const [skillsData, setSkillsData] = useState<SkillsData>(initialSkillsData);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isEditSkillOpen, setIsEditSkillOpen] = useState(false);
  const [newSkill, setNewSkill] = useState<{
    name: string;
    level: string;
    category: string;
  }>({
    name: '',
    level: 'beginner',
    category: 'Ծրագրավորման լեզուներ'
  });
  const [editingSkill, setEditingSkill] = useState<{
    name: string;
    level: string;
    category: string;
    originalName: string;
    originalCategory: string;
  } | null>(null);
  
  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      toast.error("Խնդրում ենք լրացնել հմտության անվանումը");
      return;
    }
    
    // Check if skill already exists in the selected category
    const categorySkills = skillsData[newSkill.category] || [];
    const skillExists = categorySkills.some(
      skill => skill.name.toLowerCase() === newSkill.name.toLowerCase()
    );
    
    if (skillExists) {
      toast.error("Այս հմտությունն արդեն ավելացված է տվյալ կատեգորիայում");
      return;
    }
    
    const updatedSkillsData = { ...skillsData };
    
    // Create category if it doesn't exist
    if (!updatedSkillsData[newSkill.category]) {
      updatedSkillsData[newSkill.category] = [];
    }
    
    // Add new skill
    updatedSkillsData[newSkill.category].push({
      name: newSkill.name,
      level: newSkill.level,
      verified: false
    });
    
    setSkillsData(updatedSkillsData);
    setNewSkill({
      name: '',
      level: 'beginner',
      category: newSkill.category
    });
    setIsAddSkillOpen(false);
    
    toast.success("Հմտությունը հաջողությամբ ավելացվել է");
  };

  const handleEditSkill = () => {
    if (!editingSkill || !editingSkill.name.trim()) {
      toast.error("Խնդրում ենք լրացնել հմտության անվանումը");
      return;
    }
    
    // Close the dialog first to avoid visual jumps
    setIsEditSkillOpen(false);
    
    const updatedSkillsData = { ...skillsData };
    
    // If category has changed, we need to remove from old and add to new
    if (editingSkill.category !== editingSkill.originalCategory) {
      // Remove from original category
      updatedSkillsData[editingSkill.originalCategory] = updatedSkillsData[editingSkill.originalCategory].filter(
        skill => skill.name !== editingSkill.originalName
      );
      
      // Create new category if it doesn't exist
      if (!updatedSkillsData[editingSkill.category]) {
        updatedSkillsData[editingSkill.category] = [];
      }
      
      // Add to new category
      updatedSkillsData[editingSkill.category].push({
        name: editingSkill.name,
        level: editingSkill.level,
        verified: false // Reset verification when moving categories
      });
    } else {
      // Just update in the same category
      const skillIndex = updatedSkillsData[editingSkill.category].findIndex(
        skill => skill.name === editingSkill.originalName
      );
      
      if (skillIndex !== -1) {
        const wasVerified = updatedSkillsData[editingSkill.category][skillIndex].verified;
        
        updatedSkillsData[editingSkill.category][skillIndex] = {
          name: editingSkill.name,
          level: editingSkill.level,
          verified: editingSkill.name === editingSkill.originalName ? wasVerified : false
        };
      }
    }
    
    // Clean up empty categories
    Object.keys(updatedSkillsData).forEach(category => {
      if (updatedSkillsData[category].length === 0) {
        delete updatedSkillsData[category];
      }
    });
    
    setSkillsData(updatedSkillsData);
    setEditingSkill(null);
    
    toast.success("Հմտությունը հաջողությամբ թարմացվել է");
  };

  const handleDeleteSkill = (categoryName: string, skillName: string) => {
    const updatedSkillsData = { ...skillsData };
    
    updatedSkillsData[categoryName] = updatedSkillsData[categoryName].filter(
      skill => skill.name !== skillName
    );
    
    // Remove empty category
    if (updatedSkillsData[categoryName].length === 0) {
      delete updatedSkillsData[categoryName];
    }
    
    setSkillsData(updatedSkillsData);
    toast.success("Հմտությունը հաջողությամբ հեռացվել է");
  };

  const openEditSkillDialog = (categoryName: string, skill: Skill) => {
    setEditingSkill({
      name: skill.name,
      level: skill.level,
      category: categoryName,
      originalName: skill.name,
      originalCategory: categoryName
    });
    setIsEditSkillOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Հմտություններ</h2>
          <div>
            <Button size="sm" className="flex items-center gap-1" onClick={() => setIsAddSkillOpen(true)}>
              <Plus size={16} />
              Ավելացնել հմտություն
            </Button>
          </div>
        </div>
        
        {Object.entries(skillsData).length > 0 ? (
          Object.entries(skillsData).map(([category, skills]) => (
            <Card key={category} className="mb-6">
              <CardHeader>
                <CardTitle>{category}</CardTitle>
                <CardDescription>
                  {skills.length} հմտություն այս կատեգորիայում
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skills.map(skill => (
                    <div key={skill.name} className="flex justify-between items-center p-3 border rounded-md hover:bg-slate-50">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{skill.name}</span>
                        {skill.verified && (
                          <Badge variant="outline" className="bg-green-50">Հաստատված</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${levelLabels[skill.level]?.className}`}>
                          {levelLabels[skill.level]?.label}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="flex items-center gap-1 text-slate-600"
                          onClick={() => openEditSkillDialog(category, skill)}
                        >
                          <Pencil size={14} />
                          Խմբագրել
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteSkill(category, skill.name)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Դուք դեռ չունեք ավելացված հմտություններ</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => setIsAddSkillOpen(true)}
            >
              Ավելացնել հմտություն
            </Button>
          </div>
        )}
      </div>

      {/* Add Skill Dialog */}
      <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Նոր հմտության ավելացում</DialogTitle>
            <DialogDescription>
              Ավելացրեք նոր հմտություն Ձեր պորտֆոլիոյին
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Կատեգորիա</label>
              <Select
                value={newSkill.category}
                onValueChange={(value) => setNewSkill({...newSkill, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ընտրեք կատեգորիան" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Հմտության անվանում</label>
              <Input 
                value={newSkill.name} 
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})} 
                placeholder="Օր.՝ React, TypeScript, JavaScript"
              />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Մակարդակ</label>
              <Select
                value={newSkill.level}
                onValueChange={(value) => setNewSkill({...newSkill, level: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ընտրեք մակարդակը" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Սկսնակ</SelectItem>
                  <SelectItem value="intermediate">Միջին</SelectItem>
                  <SelectItem value="expert">Փորձառու</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSkillOpen(false)}>Չեղարկել</Button>
            <Button onClick={handleAddSkill}>Ավելացնել</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Skill Dialog */}
      {editingSkill && (
        <Dialog open={isEditSkillOpen} onOpenChange={setIsEditSkillOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Հմտության խմբագրում</DialogTitle>
              <DialogDescription>
                Թարմացրեք Ձեր հմտության տվյալները
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Կատեգորիա</label>
                <Select
                  value={editingSkill.category}
                  onValueChange={(value) => setEditingSkill({...editingSkill, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ընտրեք կատեգորիան" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Հմտության անվանում</label>
                <Input 
                  value={editingSkill.name} 
                  onChange={(e) => setEditingSkill({...editingSkill, name: e.target.value})} 
                />
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Մակարդակ</label>
                <Select
                  value={editingSkill.level}
                  onValueChange={(value) => setEditingSkill({...editingSkill, level: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ընտրեք մակարդակը" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Սկսնակ</SelectItem>
                    <SelectItem value="intermediate">Միջին</SelectItem>
                    <SelectItem value="expert">Փորձառու</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditSkillOpen(false)}>Չեղարկել</Button>
              <Button onClick={handleEditSkill}>Պահպանել</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProfileSkills;
