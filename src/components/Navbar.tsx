
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
import { LogOut, User, Settings, BookOpen, Calendar } from "lucide-react";

const Navbar = () => {
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  
  // Check if we're on the homepage
  const isHomepage = location.pathname === '/';
  
  return (
    <header className={cn(
      "w-full py-4 px-6 md:px-10 flex items-center justify-between",
      isHomepage ? "absolute top-0 left-0 z-50 bg-transparent" : "bg-white border-b"
    )}>
      <div className="flex items-center">
        <Link to="/" className={cn(
          "text-2xl font-bold",
          isHomepage ? "text-white" : "text-[#3E64FF]"
        )}>
          UpSkill
        </Link>
        
        <NavigationMenu className="hidden md:flex ml-10">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={isHomepage ? "text-white" : ""}>
                Subjects
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {subjects.map((subject) => (
                    <ListItem
                      key={subject.title}
                      title={subject.title}
                      href={subject.href}
                    >
                      {subject.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/tutors" className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                isHomepage ? "text-white" : ""
              )}>
                Find Tutors
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/about" className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                isHomepage ? "text-white" : ""
              )}>
                About Us
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
                isHomepage ? "text-white hover:bg-white/20" : ""
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
                    <Settings className="mr-2 h-4 w-4" />
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
                {role === 'tutor' && (
                  <DropdownMenuItem asChild>
                    <Link to="/sessions" className="cursor-pointer flex w-full items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>My Sessions</span>
                    </Link>
                  </DropdownMenuItem>
                )}
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
              className={cn(
                isHomepage ? "text-white hover:bg-white/20" : ""
              )}
              asChild
            >
              <Link to="/login">Log in</Link>
            </Button>
            <Button 
              variant={isHomepage ? "secondary" : "default"} 
              className={isHomepage ? "bg-white text-[#3E64FF] hover:bg-gray-100" : ""}
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

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const subjects = [
  {
    title: "Mathematics",
    href: "/subjects/mathematics",
    description: "Algebra, Calculus, Statistics, Geometry and more",
  },
  {
    title: "Science",
    href: "/subjects/science",
    description: "Physics, Chemistry, Biology, Computer Science",
  },
  {
    title: "Languages",
    href: "/subjects/languages",
    description: "English, Spanish, French, German, Mandarin",
  },
  {
    title: "Humanities",
    href: "/subjects/humanities",
    description: "History, Geography, Philosophy, Literature",
  },
  {
    title: "Test Preparation",
    href: "/subjects/test-prep",
    description: "SAT, ACT, GRE, GMAT, LSAT, MCAT",
  },
  {
    title: "Professional Skills",
    href: "/subjects/professional",
    description: "Business, Marketing, Programming, Design",
  },
];

export default Navbar;
