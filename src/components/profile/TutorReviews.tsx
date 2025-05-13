
import React from "react";
import { Star, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Review {
  id: string;
  studentName: string;
  studentPhoto?: string;
  rating: number;
  date: string;
  comment: string;
  subject: string;
}

interface TutorReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

const TutorReviews: React.FC<TutorReviewsProps> = ({ 
  reviews,
  averageRating,
  totalReviews
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Reviews</span>
          <div className="flex items-center">
            <div className="flex mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(averageRating) ? "#FFD700" : "none"}
                  stroke={i < Math.floor(averageRating) ? "#FFD700" : "#CBD5E0"}
                />
              ))}
            </div>
            <span>{averageRating.toFixed(1)} ({totalReviews})</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>This tutor doesn't have any reviews yet.</p>
            <p className="mt-2">Be the first to leave a review after your session!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={review.studentPhoto} />
                      <AvatarFallback>{review.studentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{review.studentName}</h4>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={i < Math.floor(review.rating) ? "#FFD700" : "none"}
                              stroke={i < Math.floor(review.rating) ? "#FFD700" : "#CBD5E0"}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{review.subject}</Badge>
                </div>
                
                <p className="mt-3 text-gray-700">{review.comment}</p>
                
                <div className="mt-3">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary">
                    <ThumbsUp className="mr-1 h-3 w-3" /> Helpful
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TutorReviews;
