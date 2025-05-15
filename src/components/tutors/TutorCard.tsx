
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface TutorCardProps {
  tutor: {
    id: string;
    profile_picture_url?: string;
    full_name?: string;
    subjects?: string[];
    hourly_rate?: number;
    rating: number;
    total_reviews?: number;
    location?: string;
    experience?: string;
  };
  onViewProfile: (id: string) => void;
  onBookSession: (id: string) => void;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor, onViewProfile, onBookSession }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src={tutor.profile_picture_url} />
              <AvatarFallback>{tutor.full_name?.charAt(0) || "T"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{tutor.full_name}</h3>
              <div className="flex items-center mt-1">
                <Star size={16} className="text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{tutor.rating}</span>
                <span className="text-sm text-gray-500 ml-1">
                  ({tutor.total_reviews} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1 mt-2">
              {tutor.subjects?.slice(0, 3).map((subject) => (
                <Badge key={subject} variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                  {subject}
                </Badge>
              ))}
              {tutor.subjects && tutor.subjects.length > 3 && (
                <Badge variant="outline" className="bg-gray-50 text-gray-600">
                  +{tutor.subjects.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Rate and experience */}
          <div className="mb-4">
            <p className="text-lg font-semibold text-green-600">${tutor.hourly_rate}/hour</p>
            {tutor.experience && (
              <p className="text-sm text-gray-600 mt-1">{tutor.experience}</p>
            )}
            {tutor.location && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Location:</span> {tutor.location}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onViewProfile(tutor.id)}
            >
              View Profile
            </Button>
            <Button
              className="flex-1"
              onClick={() => onBookSession(tutor.id)}
            >
              Book Session
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorCard;
