
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  User, 
  Calendar, 
  Clock, 
  Star, 
  Home, 
  FileText, 
  Search, 
  Settings, 
  LogOut 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface SidebarLink {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface DashboardSidebarProps {
  userType: "tutor" | "student";
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ userType }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
    });
    navigate('/');
  };

  const tutorLinks: SidebarLink[] = [
    { icon: <Home size={20} />, label: "Dashboard", href: "/tutor-dashboard" },
    { icon: <User size={20} />, label: "Profile", href: "/profile" },
    { icon: <Calendar size={20} />, label: "Bookings", href: "/tutor-dashboard?tab=bookings" },
    { icon: <Clock size={20} />, label: "Availability", href: "/tutor-dashboard?tab=availability" },
    { icon: <Star size={20} />, label: "Reviews", href: "/tutor-dashboard?tab=reviews" },
    { icon: <FileText size={20} />, label: "Earnings", href: "/tutor-dashboard?tab=earnings" },
    { icon: <Settings size={20} />, label: "Settings", href: "/tutor-dashboard?tab=settings" },
  ];

  const studentLinks: SidebarLink[] = [
    { icon: <Home size={20} />, label: "Dashboard", href: "/student-dashboard" },
    { icon: <User size={20} />, label: "Profile", href: "/profile" },
    { icon: <Calendar size={20} />, label: "My Sessions", href: "/student-dashboard?tab=sessions" },
    { icon: <Search size={20} />, label: "Find Tutors", href: "/student-dashboard?tab=find-tutors" },
    { icon: <Star size={20} />, label: "My Favorites", href: "/student-dashboard?tab=favorites" },
    { icon: <Settings size={20} />, label: "Settings", href: "/student-dashboard?tab=settings" },
  ];

  const links = userType === "tutor" ? tutorLinks : studentLinks;

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="p-6">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-primary">UpSkill</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-6">
        <nav className="space-y-1 px-3">
          {links.map((link) => {
            const isActive = location.pathname === link.href || 
                           (link.href.includes('?') && 
                            location.pathname + location.search === link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <span className="mr-3">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-200"
        >
          <LogOut className="mr-3" size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
