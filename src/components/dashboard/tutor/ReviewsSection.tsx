
import React from "react";
import { Star, Flag, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  studentName: string;
  studentPhoto?: string;
  rating: number;
  comment: string;
  date: string;
  subject: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ 
  reviews, 
  averageRating, 
  totalReviews 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Reviews</CardTitle>
        {totalReviews > 5 && <Button variant="outline" size="sm">View All</Button>}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg flex-1 text-center">
            <div className="text-4xl font-bold text-primary">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center my-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(averageRating) ? "#FFD700" : "none"}
                  stroke={i < Math.floor(averageRating) ? "#FFD700" : "#CBD5E0"}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">Based on {totalReviews} reviews</p>
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium mb-3">Rating Breakdown</h3>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter(r => Math.floor(r.rating) === rating).length;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-2 mb-2">
                  <div className="flex items-center w-16">
                    <span>{rating}</span>
                    <Star size={14} className="ml-1" fill="#FFD700" stroke="#FFD700" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-10">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="space-y-4">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={review.studentPhoto} />
                    <AvatarFallback>{review.studentName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{review.studentName}</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < Math.floor(review.rating) ? "#FFD700" : "none"}
                          stroke={i < Math.floor(review.rating) ? "#FFD700" : "#CBD5E0"}
                          className="mr-0.5"
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">{review.date}</span>
                    </div>
                    <div className="text-xs text-gray-500">Subject: {review.subject}</div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-gray-700">{review.comment}</p>
              <div className="flex gap-2 mt-3">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary">
                  <ThumbsUp className="h-4 w-4 mr-1" /> Thank
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-destructive">
                  <Flag className="h-4 w-4 mr-1" /> Report
                </Button>
              </div>
            </div>
          ))}
          
          {reviews.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't received any reviews yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewsSection;
