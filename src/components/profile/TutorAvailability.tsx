
import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

interface AvailableSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
}

interface TutorAvailabilityProps {
  availableSlots: AvailableSlot[];
  onBookSlot: (slotId: string) => void;
}

const TutorAvailability: React.FC<TutorAvailabilityProps> = ({ 
  availableSlots,
  onBookSlot
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const availableDates = availableSlots.map(slot => {
    return new Date(slot.date).toDateString();
  });

  const filteredSlots = selectedDate
    ? availableSlots.filter(
        slot => new Date(slot.date).toDateString() === selectedDate.toDateString()
      )
    : [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-primary" /> Available Time Slots
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border pointer-events-auto"
            />
            <div className="mt-2 text-center text-sm text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 bg-primary rounded-full"></span>
                <span>Available days</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-4">
              {selectedDate ? (
                `Available on ${selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}`
              ) : (
                "Select a date to view available slots"
              )}
            </h3>
            
            {filteredSlots.length > 0 ? (
              <div className="space-y-3">
                {filteredSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex justify-between items-center p-3 border rounded-md hover:border-primary hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-primary" />
                      <span>
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onBookSlot(slot.id)}
                    >
                      Book
                    </Button>
                  </div>
                ))}
              </div>
            ) : selectedDate ? (
              <div className="text-center py-8 text-gray-500">
                <p>No available slots for this date.</p>
                <p className="mt-2">Please select another date.</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Please select a date to see available slots.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorAvailability;
