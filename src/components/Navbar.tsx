
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Calendar, MessageSquare, Book } from "lucide-react";

const Navbar = () => {
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  
  // Check if we're on the homepage
  const isHomepage = location.pathname === '/';
  
  // Skills dropdown data
  const skillCategories = [
    {
      title: "Programming",
      items: ["Python", "JavaScript", "React", "Data Science"]
    },
    {
      title: "Business",
      items: ["Marketing", "SEO", "Public Speaking", "Leadership"]
    },
    {
      title: "Design",
      items: ["UI/UX", "Figma", "Adobe Suite", "Graphic Design"]
    },
    {
      title: "Academics",
      items: ["Mathematics", "Physics", "Chemistry", "Biology"]
    }
  ];
  
  return (
    <header className={cn(
      "w-full py-4 px-6 md:px-10 flex items-center justify-between",
      isHomepage ? "absolute top-0 left-0 z-50 bg-transparent" : "bg-white border-b"
    )}>
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-[#3E64FF]">
          UpSkill
        </Link>
        
        <NavigationMenu className="hidden md:flex ml-10">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={cn(
                "text-[#3E64FF] bg-transparent hover:bg-accent/50"
              )}>
                Skills
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white p-4 rounded-md shadow-lg w-[500px]">
                <div className="grid grid-cols-2 gap-4">
                  {skillCategories.map((category) => (
                    <div key={category.title}>
                      <h3 className="font-medium text-[#3E64FF] mb-2">{category.title}</h3>
                      <ul className="space-y-1">
                        {category.items.map((item) => (
                          <li key={item}>
                            <Link 
                              to={`/skills?category=${category.title.toLowerCase()}&skill=${item.toLowerCase()}`}
                              className="text-sm text-gray-600 hover:text-[#3E64FF] hover:underline"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/tutors" className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                isHomepage ? "text-[#3E64FF]" : "text-[#3E64FF]"
              )}>
                Find Tutors
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/insights" className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                isHomepage ? "text-[#3E64FF]" : "text-[#3E64FF]"
              )}>
                Insights
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Button 
              variant="ghost" 
              className={cn(
                "hidden md:flex",
                isHomepage ? "text-[#3E64FF] hover:bg-white/20" : ""
              )}
              asChild
            >
              <Link to={role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard'}>
                Dashboard
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="rounded-full h-10 w-10 p-0 overflow-hidden"
                >
                  <Avatar>
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-[#3E64FF] text-white">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex w-full items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard'} className="cursor-pointer flex w-full items-center">
                    <Book className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                {role === 'student' && (
                  <DropdownMenuItem asChild>
                    <Link to="/bookings" className="cursor-pointer flex w-full items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>My Bookings</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/messages" className="cursor-pointer flex w-full items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button 
              variant="ghost" 
              className="text-[#3E64FF] hover:bg-[#3E64FF]/10"
              asChild
            >
              <Link to="/login">Log in</Link>
            </Button>
            <Button 
              variant="default" 
              className="bg-[#3E64FF] hover:bg-[#2D4FD6]"
              asChild
            >
              <Link to="/register">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
