
import React from "react";
import { Calendar, Clock, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string;
  studentName: string;
  studentPhoto?: string;
  subject: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "canceled";
  duration: number;
}

interface BookingsSectionProps {
  bookings: Booking[];
}

const BookingsSection: React.FC<BookingsSectionProps> = ({ bookings }) => {
  const upcomingBookings = bookings.filter(booking => booking.status === "upcoming");
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Upcoming Sessions</CardTitle>
        <Button variant="outline" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        {upcomingBookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>You have no upcoming sessions.</p>
            <Button className="mt-4" variant="outline">Update Availability</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 items-start justify-between"
              >
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src={booking.studentPhoto} />
                    <AvatarFallback>{booking.studentName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{booking.studentName}</h4>
                    <Badge variant="outline">{booking.subject}</Badge>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{booking.time} ({booking.duration}h)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <Button className="bg-accent">
                    <Video className="mr-2 h-4 w-4" /> Start Session
                  </Button>
                  <Button variant="outline">Reschedule</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingsSection;
