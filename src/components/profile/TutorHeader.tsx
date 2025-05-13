
import React from "react";
import { Star, Award, Check, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface TutorHeaderProps {
  tutor: {
    id: string;
    name: string;
    photo?: string;
    subjects: string[];
    rating: number;
    totalReviews: number;
    isVerified: boolean;
    isTopRated: boolean;
    headline: string;
  };
}

const TutorHeader: React.FC<TutorHeaderProps> = ({ tutor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-accent h-24"></div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row">
          <div className="-mt-16 md:-mt-20">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white relative bg-white overflow-hidden">
              <AspectRatio ratio={1 / 1}>
                {tutor.photo ? (
                  <img 
                    src={tutor.photo} 
                    alt={tutor.name} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400 text-2xl font-bold">
                    {tutor.name.charAt(0)}
                  </div>
                )}
              </AspectRatio>
              
              {tutor.isVerified && (
                <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-6 flex-1">
            <Link 
              to="/student-dashboard"
              className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-2"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  {tutor.name}
                  {tutor.isVerified && (
                    <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                      <Check size={12} className="mr-1" /> Verified
                    </Badge>
                  )}
                </h1>
                <p className="text-gray-600">{tutor.headline}</p>
              </div>
              
              <div className="mt-4 md:mt-0">
                {tutor.isTopRated && (
                  <div className="flex items-center text-amber-500 mb-2">
                    <Award className="mr-1 h-4 w-4" />
                    <span className="text-sm font-medium">Top Rated Tutor</span>
                  </div>
                )}
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.floor(tutor.rating) ? "#FFD700" : "none"}
                        stroke={i < Math.floor(tutor.rating) ? "#FFD700" : "#CBD5E0"}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 text-sm">
                    {tutor.rating.toFixed(1)} ({tutor.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {tutor.subjects.map((subject, index) => (
                <Badge key={index} variant="outline">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorHeader;
