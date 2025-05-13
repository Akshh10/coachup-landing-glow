
import React from "react";
import { Calendar, Clock, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WelcomeSectionProps {
  studentName: string;
  upcomingSessions: number;
  completedSessions: number;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ 
  studentName,
  upcomingSessions,
  completedSessions
}) => {
  const currentTime = new Date();
  const hour = currentTime.getHours();
  
  let greeting = "Good morning";
  if (hour >= 12 && hour < 18) {
    greeting = "Good afternoon";
  } else if (hour >= 18) {
    greeting = "Good evening";
  }
  
  return (
    <Card className="bg-gradient-to-r from-primary/80 to-accent/80 text-white">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{greeting}, {studentName}!</h1>
            <p className="mb-6 opacity-90">
              Welcome back to your personalized learning journey.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  <h3 className="font-medium">Upcoming Sessions</h3>
                </div>
                <p className="text-3xl font-bold mt-2">{upcomingSessions}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  <h3 className="font-medium">Completed Sessions</h3>
                </div>
                <p className="text-3xl font-bold mt-2">{completedSessions}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 md:ml-6 md:text-right">
            <Button className="bg-white text-primary hover:bg-white/90 transition-colors mb-3">
              <Search className="mr-2 h-4 w-4" /> Find a Tutor
            </Button>
            <p className="text-sm opacity-90">
              Need help with a specific subject?<br />
              Our tutors are ready to assist you.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
