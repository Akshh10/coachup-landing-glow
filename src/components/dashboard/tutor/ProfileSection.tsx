
import React from "react";
import { Edit, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileSectionProps {
  profile: {
    name: string;
    photo?: string;
    title: string;
    rating: number;
    subjects: string[];
    hourlyRate: number;
    bio: string;
  };
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile }) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-accent h-24"></div>
      <CardContent className="relative pt-0">
        <div className="flex justify-end -mt-4">
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Edit size={16} />
            <span>Edit Profile</span>
          </Button>
        </div>
        
        <div className="-mt-12 flex flex-col sm:flex-row items-center">
          <Avatar className="h-24 w-24 border-4 border-white shadow-md">
            <AvatarImage src={profile.photo} />
            <AvatarFallback className="text-lg">{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-gray-500">{profile.title}</p>
            
            <div className="flex items-center mt-2 justify-center sm:justify-start">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(profile.rating) ? "#FFD700" : "none"}
                    stroke={i < Math.floor(profile.rating) ? "#FFD700" : "#CBD5E0"}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">{profile.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.subjects.map((subject, index) => (
              <Badge key={index} variant="outline">{subject}</Badge>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
            <div>
              <h3 className="font-medium text-gray-700">About Me</h3>
              <p className="mt-2 text-gray-600">{profile.bio}</p>
            </div>
            
            <div className="sm:text-right">
              <h3 className="font-medium text-gray-700">Hourly Rate</h3>
              <p className="text-2xl font-bold text-primary">${profile.hourlyRate}</p>
              <Button className="mt-2 w-full sm:w-auto">Edit Rate</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
