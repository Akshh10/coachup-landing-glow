
import React from "react";
import { Bell, MessageSquare, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName: string;
  userType: "tutor" | "student";
  userImage?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  userName, 
  userType,
  userImage 
}) => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center w-full max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              placeholder={userType === "tutor" ? "Search your students..." : "Search for tutors..."}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <MessageSquare size={20} />
          </Button>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{userName}</div>
              <div className="text-xs text-gray-500 capitalize">{userType}</div>
            </div>
            <Avatar>
              <AvatarImage src={userImage} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
