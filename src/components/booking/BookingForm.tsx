import React, { useState } from "react";
import { Calendar, Clock, MessageSquare, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { addHours, format } from "date-fns";

interface BookingFormProps {
  tutorName: string;
  tutorPhoto?: string;
  subjects: string[];
  hourlyRate: number;
  tutorId: string;
}

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", 
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
];

const BookingForm: React.FC<BookingFormProps> = ({ 
  tutorName, 
  tutorPhoto,
  subjects, 
  hourlyRate,
  tutorId
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [duration, setDuration] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSubject || !selectedDate || !selectedTime || !user) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Parse the selected time
      const [time, period] = selectedTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      
      // Convert to 24-hour format
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      
      // Create start time
      const startTime = new Date(selectedDate);
      startTime.setHours(hours, minutes, 0, 0);
      
      // Calculate end time based on duration
      const endTime = addHours(startTime, duration);
      
      console.log('Creating booking with data:', {
        student_id: user.id,
        tutor_id: tutorId,
        subject: selectedSubject,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: 'pending',
        note: message || null
      });

      // Insert booking into Supabase
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          student_id: user.id,
          tutor_id: tutorId,
          subject: selectedSubject,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: 'pending',
          note: message || null
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }

      console.log('Booking created successfully:', data);
      
      toast.success("Booking submitted successfully!");
      
      // Navigate back to student dashboard
      setTimeout(() => {
        navigate("/student-dashboard");
      }, 2000);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Book a Session with {tutorName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Subject Selection */}
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={selectedSubject} 
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Date</Label>
                <div className="mt-2 border rounded-md">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md pointer-events-auto"
                  />
                </div>
              </div>
              
              <div>
                <Label>Time</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {timeSlots.map((time) => (
                    <Badge
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={`cursor-pointer py-1 flex justify-center ${
                        selectedTime === time ? "" : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Badge>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="duration">Session Duration</Label>
                  <Select 
                    value={duration.toString()} 
                    onValueChange={(value) => setDuration(Number(value))}
                  >
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="1.5">1.5 hours</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="2.5">2.5 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Message */}
            <div>
              <Label htmlFor="message">What would you like help with?</Label>
              <Textarea
                id="message"
                placeholder="Describe what you need help with, your goals, or any questions you have..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            
            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Hourly Rate:</span>
                  <span>${hourlyRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{duration} {duration === 1 ? 'hour' : 'hours'}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${(hourlyRate * duration).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Confirm Booking"}
            </Button>
            
            <div className="text-center text-xs text-gray-500">
              By confirming this booking, you agree to our Terms of Service and Cancellation Policy.
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
