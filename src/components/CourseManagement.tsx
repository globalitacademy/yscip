
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Pencil } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  description: string;
  specialization?: string;
  duration: string;
  modules: string[];
}

// Mock data
const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Վեբ ծրագրավորում',
    description: 'HTML, CSS, JavaScript, React և Node.js օգտագործելով վեբ հավելվածների մշակում',
    specialization: 'Ծրագրավորում',
    duration: '4 ամիս',
    modules: ['HTML/CSS հիմունքներ', 'JavaScript', 'React', 'Node.js/Express', 'Վերջնական նախագիծ']
  },
  {
    id: '2',
    name: 'Մեքենայական ուսուցում',
    description: 'Ներածություն մեքենայական ուսուցման մեջ՝ օգտագործելով Python և TensorFlow',
    specialization: 'Տվյալագիտություն',
    duration: '6 ամիս',
    modules: ['Python հիմունքներ', 'Տվյալների վերլուծություն', 'Վիճակագրություն', 'Մեքենայական ուսուցման մոդելներ', 'Խորը ուսուցում', 'Վերջնական նախագիծ']
  }
];

const mockSpecializations = ['Ծրագրավորում', 'Տվյալագիտություն', 'Դիզայն', 'Մարկետինգ', 'Բիզնես վերլուծություն'];

// Check if courses are already in localStorage, otherwise use mock data
const initializeCourses = () => {
  const storedCourses = localStorage.getItem('courses');
  if (storedCourses) {
    try {
      return JSON.parse(storedCourses);
    } catch (e) {
      console.error('Error parsing stored courses:', e);
    }
  }
  return mockCourses;
};

const CourseManagement: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(initializeCourses());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: '',
    description: '',
    specialization: '',
    duration: '',
    modules: []
  });
  const [newModule, setNewModule] = useState('');

  const isAdmin = user?.role === 'admin';

  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.description || !newCourse.duration) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const courseToAdd: Course = {
      id: uuidv4(),
      name: newCourse.name,
      description: newCourse.description,
      specialization: newCourse.specialization,
      duration: newCourse.duration,
      modules: newCourse.modules || []
    };

    const updatedCourses = [...courses, courseToAdd];
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    
    setNewCourse({
      name: '',
      description: '',
      specialization: '',
      duration: '',
      modules: []
    });
    setIsAddDialogOpen(false);
    toast.success('Կուրսը հաջողությամբ ավելացվել է');
  };

  const handleEditCourse = () => {
    if (!selectedCourse) return;
    
    if (!selectedCourse.name || !selectedCourse.description || !selectedCourse.duration) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const updatedCourses = courses.map(course => 
      course.id === selectedCourse.id ? selectedCourse : course
    );
    
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    setIsEditDialogOpen(false);
    toast.success('Կուրսը հաջողությամբ թարմացվել է');
  };

  const handleEditInit = (course: Course) => {
    setSelectedCourse({...course});
    setIsEditDialogOpen(true);
  };

  const handleAddModule = () => {
    if (!newModule) return;
    setNewCourse({
      ...newCourse,
      modules: [...(newCourse.modules || []), newModule]
    });
    setNewModule('');
  };

  const handleRemoveModule = (index: number) => {
    const updatedModules = [...(newCourse.modules || [])];
    updatedModules.splice(index, 1);
    setNewCourse({
      ...newCourse,
      modules: updatedModules
    });
  };

  const handleAddModuleToEdit = () => {
    if (!newModule || !selectedCourse) return;
    setSelectedCourse({
      ...selectedCourse,
      modules: [...selectedCourse.modules, newModule]
    });
    setNewModule('');
  };

  const handleRemoveModuleFromEdit = (index: number) => {
    if (!selectedCourse) return;
    const updatedModules = [...selectedCourse.modules];
    updatedModules.splice(index, 1);
    setSelectedCourse({
      ...selectedCourse,
      modules: updatedModules
    });
  };

  const handleDeleteCourse = (id: string) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    toast.success('Կուրսը հաջողությամբ հեռացվել է');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Կուրսերի կառավարում</h1>
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Ավելացնել նոր կուրս</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Նոր կուրսի ավելացում</DialogTitle>
                <DialogDescription>
                  Լրացրեք կուրսի տվյալները ներքևում: Պատրաստ լինելուց հետո սեղմեք "Ավելացնել" կոճակը:
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Անվանում
                  </Label>
                  <Input
                    id="name"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="specialization" className="text-right">
                    Մասնագիտություն
                  </Label>
                  <Select 
                    value={newCourse.specialization} 
                    onValueChange={(value) => setNewCourse({ ...newCourse, specialization: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Ընտրեք մասնագիտությունը" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSpecializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    Տևողություն
                  </Label>
                  <Input
                    id="duration"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                    className="col-span-3"
                    placeholder="Օր. 4 ամիս"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Նկարագրություն
                  </Label>
                  <Textarea
                    id="description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Մոդուլներ</Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newModule}
                        onChange={(e) => setNewModule(e.target.value)}
                        placeholder="Մոդուլի անվանում"
                      />
                      <Button type="button" onClick={handleAddModule} size="sm">
                        Ավելացնել
                      </Button>
                    </div>
                    {newCourse.modules && newCourse.modules.length > 0 && (
                      <ul className="space-y-1 mt-2">
                        {newCourse.modules.map((module, index) => (
                          <li key={index} className="flex justify-between items-center bg-secondary/30 p-2 rounded">
                            {module}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveModule(index)}
                              className="h-5 w-5 text-destructive"
                            >
                              ✕
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddCourse}>
                  Ավելացնել
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Բոլոր կուրսերը</TabsTrigger>
          <TabsTrigger value="my">Իմ կուրսերը</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 mt-4">
          {courses.length === 0 ? (
            <p className="text-center text-gray-500">Կուրսեր չկան</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">{course.name}</CardTitle>
                        <CardDescription>{course.specialization}</CardDescription>
                      </div>
                      {isAdmin && (
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-primary" 
                            onClick={() => handleEditInit(course)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive" 
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            ✕
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">Տևողություն:</span>
                        <span>{course.duration}</span>
                      </div>
                      <div className="text-sm">
                        <div className="font-semibold mb-1">Մոդուլներ:</div>
                        <ul className="list-disc list-inside">
                          {course.modules.map((module, index) => (
                            <li key={index} className="text-sm">{module}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2">
                        <Button size="sm" className="w-full">Դիտել մանրամասները</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="my" className="space-y-4 mt-4">
          <p className="text-center text-gray-500">Կուրսեր չկան: Դասախոսները կտեսնեն իրենց նշանակված կուրսերը այստեղ:</p>
        </TabsContent>
      </Tabs>

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Կուրսի խմբագրում</DialogTitle>
            <DialogDescription>
              Փոփոխեք կուրսի տվյալները ներքևում: Պատրաստ լինելուց հետո սեղմեք "Պահպանել" կոճակը:
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Անվանում
                </Label>
                <Input
                  id="edit-name"
                  value={selectedCourse.name}
                  onChange={(e) => setSelectedCourse({ ...selectedCourse, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-specialization" className="text-right">
                  Մասնագիտություն
                </Label>
                <Select 
                  value={selectedCourse.specialization} 
                  onValueChange={(value) => setSelectedCourse({ ...selectedCourse, specialization: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Ընտրեք մասնագիտությունը" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSpecializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-duration" className="text-right">
                  Տևողություն
                </Label>
                <Input
                  id="edit-duration"
                  value={selectedCourse.duration}
                  onChange={(e) => setSelectedCourse({ ...selectedCourse, duration: e.target.value })}
                  className="col-span-3"
                  placeholder="Օր. 4 ամիս"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-description" className="text-right pt-2">
                  Նկարագրություն
                </Label>
                <Textarea
                  id="edit-description"
                  value={selectedCourse.description}
                  onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Մոդուլներ</Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newModule}
                      onChange={(e) => setNewModule(e.target.value)}
                      placeholder="Մոդուլի անվանում"
                    />
                    <Button type="button" onClick={handleAddModuleToEdit} size="sm">
                      Ավելացնել
                    </Button>
                  </div>
                  {selectedCourse.modules.length > 0 && (
                    <ul className="space-y-1 mt-2">
                      {selectedCourse.modules.map((module, index) => (
                        <li key={index} className="flex justify-between items-center bg-secondary/30 p-2 rounded">
                          {module}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveModuleFromEdit(index)}
                            className="h-5 w-5 text-destructive"
                          >
                            ✕
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleEditCourse}>
              Պահպանել
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseManagement;
