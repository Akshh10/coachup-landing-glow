
import React, { useState } from "react";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface AvailabilitySectionProps {
  timeSlots: TimeSlot[];
}

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({ timeSlots }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Manage Availability</CardTitle>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Time Slot
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-4">
              <h3 className="font-medium">Weekly Schedule</h3>
              <Button variant="outline" size="sm">Edit Schedule</Button>
            </div>
            
            <div className="space-y-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                const daySlots = timeSlots.filter(slot => slot.day === day);
                
                return (
                  <div key={day} className="flex justify-between items-center py-2 border-b last:border-0">
                    <span className="font-medium w-24">{day}</span>
                    <div className="flex-1">
                      {daySlots.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {daySlots.map((slot) => (
                            <Badge key={slot.id} variant="outline">
                              {slot.startTime} - {slot.endTime}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Not available</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-4">
              <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-medium">Calendar View</h3>
            </div>
            
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm pointer-events-auto"
            />
            
            <div className="mt-4">
              <Button className="w-full" variant="outline">Sync with Google Calendar</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilitySection;
