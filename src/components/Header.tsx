
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, GraduationCap, BookOpen, Code, List } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  className
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Import the project themes dynamically
        const { projectThemes } = await import('@/data/projectThemes');
        // Extract unique categories
        const uniqueCategories = [...new Set(projectThemes.map(project => project.category))].sort();
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories([]);
      }
    };
    
    fetchCategories();
  }, []);

  const handleCategorySelect = (category: string) => {
    const url = new URL(window.location.origin);
    url.pathname = '/admin/student-projects';
    url.searchParams.set('category', category);
    navigate(url.pathname + url.search);
  };

  // Define role-based navigation
  const getRoleNavigation = () => {
    if (!user) return null;
    
    // Determine correct dashboard route based on user role
    const getDashboardRoute = () => {
      if (user.role === 'student') {
        return '/admin/my-projects';
      } else {
        return '/admin/dashboard';
      }
    };

    return (
      <div className="flex items-center gap-2 md:gap-4">
        <Link to={getDashboardRoute()}>
          <Button variant="outline" size="sm" className="gap-1">
            <LayoutDashboard size={16} />
            <span className="hidden md:inline">
              {user.role === 'student' ? 'Իմ նախագծերը' : 'Ադմին պանել'}
            </span>
          </Button>
        </Link>
        
        {user.role === 'student' && (
          <Link to="/admin/student-projects">
            <Button variant="outline" size="sm" className="gap-1">
              <GraduationCap size={16} />
              <span className="hidden md:inline">Նախագծեր</span>
            </Button>
          </Link>
        )}
      </div>
    );
  };

  return <header className={cn("border-b border-border sticky top-0 z-50 bg-background", className)}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap size={28} className="text-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">ՈՒԿՀ</span>
            </div>
          </Link>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Նախագծեր
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-[220px]">
                    <div className="font-medium mb-2 text-sm">Ծրագրի թեմաներն ըստ կատեգորիաների</div>
                    <ScrollArea className="h-[300px]">
                      <div className="flex flex-col gap-1">
                        <NavigationMenuLink 
                          asChild
                          className="block p-2 hover:bg-muted rounded text-sm cursor-pointer"
                          onClick={() => navigate('/admin/student-projects')}
                        >
                          <div>Բոլոր նախագծերը</div>
                        </NavigationMenuLink>
                        
                        {categories.map((category) => (
                          <NavigationMenuLink 
                            key={category}
                            asChild
                            className="block p-2 hover:bg-muted rounded text-sm cursor-pointer"
                            onClick={() => handleCategorySelect(category)}
                          >
                            <div>{category}</div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/admin/courses">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Դասընթացներ
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {getRoleNavigation()}
        </div>
        
        <UserMenu />
      </div>
    </header>;
};

export default Header;
