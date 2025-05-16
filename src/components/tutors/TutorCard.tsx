
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useRipple from "@/hooks/useRipple";

interface TutorCardProps {
  tutor: {
    id: string;
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
  const { createRipple } = useRipple();
  
  return (
    <motion.div
      whileHover={{ 
        scale: 1.03,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Tutor name and rating */}
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

            {/* Subjects */}
            <div>
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
            <div>
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
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 button-glow ripple-container"
                onClick={(e) => {
                  createRipple(e);
                  onViewProfile(tutor.id);
                }}
              >
                View Profile
              </Button>
              <Button
                className="flex-1 button-glow ripple-container"
                onClick={(e) => {
                  createRipple(e);
                  onBookSession(tutor.id);
                }}
              >
                Book Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TutorCard;
