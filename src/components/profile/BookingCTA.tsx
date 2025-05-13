
import React from "react";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BookingCTAProps {
  hourlyRate: number;
  tutorId: string;
  subjects: string[];
}

const BookingCTA: React.FC<BookingCTAProps> = ({ hourlyRate, tutorId, subjects }) => {
  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="text-center">Ready to Learn?</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 text-center">
          <div className="text-3xl font-bold text-primary">${hourlyRate}</div>
          <div className="text-gray-500">per hour</div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-primary mr-3" />
            <div className="text-gray-700">Responds within 24 hours</div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-primary mr-3" />
            <div className="text-gray-700">Flexible scheduling</div>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-primary mr-3" />
            <div className="text-gray-700">Money-back guarantee</div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="text-sm font-medium mb-2">Subjects:</div>
          <div className="flex flex-wrap gap-1">
            {subjects.map((subject, index) => (
              <Badge key={index} variant="outline">
                {subject}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button 
          className="w-full text-base py-6 font-semibold shadow-md hover:shadow-lg transition-all cta-button"
          onClick={() => window.location.href = `/booking/${tutorId}`}
        >
          Book This Tutor
        </Button>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          No obligation to book. Free 15-minute introduction call.
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCTA;
