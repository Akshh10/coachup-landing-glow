
import React from "react";
import { User, Star, Clock, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Tutor {
  id: string;
  name: string;
  photo?: string;
  subjects: string[];
  hourlyRate: number;
  rating: number;
  totalReviews: number;
}

interface RecommendedTutorsSectionProps {
  tutors: Tutor[];
}

const RecommendedTutorsSection: React.FC<RecommendedTutorsSectionProps> = ({ tutors }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Recommended Tutors</CardTitle>
        <Button variant="ghost" className="text-primary">
          Browse All <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutors.map((tutor) => (
            <Card key={tutor.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 border">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={tutor.photo} />
                    <AvatarFallback>
                      <User className="h-6 w-6 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{tutor.name}</h4>
                    <div className="flex items-center text-sm">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < Math.floor(tutor.rating) ? "#FFD700" : "none"}
                            stroke={i < Math.floor(tutor.rating) ? "#FFD700" : "#CBD5E0"}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-gray-500">({tutor.totalReviews})</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {tutor.subjects.slice(0, 3).map((subject, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                    {tutor.subjects.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{tutor.subjects.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>${tutor.hourlyRate}/hr</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>Available Today</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => window.location.href = `/tutor/${tutor.id}`}
                >
                  View Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedTutorsSection;
