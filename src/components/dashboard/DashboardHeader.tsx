import React, { useEffect, useState } from "react";
import { Bell, MessageSquare, Search, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import NotificationBell from "@/components/ui/NotificationBell";
import ChatPopup from "@/components/ui/ChatPopup";
import { supabase } from "@/lib/supabaseClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

interface DashboardHeaderProps {
  userName: string;
  userType: "tutor" | "student";
  userImage?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  userType,
  userImage,
}) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const [showChat, setShowChat] = useState(false);
  const [chatOpen, setchatOpen] = useState(false);
  const [hasUnread, sethasUnread] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
  
    const fetchUnread = async () => {
      const { data } = await supabase
        .from("messages")
        .select("id")
        .eq("recipient_id", user.id)
        .eq("read", false);
  
      if (data && data.length > 0) {
        sethasUnread(true);
      }
    };
  
    fetchUnread();
  
    const channel = supabase
      .channel("realtime:messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const newMsg = payload.new;
        if (newMsg.recipient_id === user.id) {
          sethasUnread(true);
        }
      })
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);
  
  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out successfully" });
    navigate("/", { replace: true });
  };

  const handleMessageClick = () => {
    setShowChat((prev) => !prev);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  
  return (
    <>
      <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center w-full max-w-md">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                placeholder={
                  userType === "tutor"
                    ? "Search your students..."
                    : "Search for tutors..."
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell userId={user?.id || ""} />
            <Button variant="ghost" onClick={handleMessageClick} className="relative">
              <MessageSquare className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-3 cursor-pointer">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium">{userName}</div>
                    <div className="text-xs text-gray-500 capitalize">{userType}</div>
                  </div>
                  <Avatar>
                    <AvatarImage src={userImage} />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      {chatOpen && <ChatPopup onClose={() => setchatOpen(false)} />}

      {/* Render ChatPopup globally to avoid layout issues */}
      {showChat && user?.id && (
        <ChatPopup onClose={() => setShowChat(false)} />
      )}
    </>
    
  );
};

export default DashboardHeader;
