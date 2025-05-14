
import React from "react";
import { Calendar, Clock, Star, RotateCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PreviousSession {
  id: string;
  tutorName: string;
  tutorPhoto?: string;
  tutorId: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  isRated: boolean;
}

interface PreviousSessionsSectionProps {
  sessions: PreviousSession[];
  onTutorClick?: (tutorId: string) => void;
}

const PreviousSessionsSection: React.FC<PreviousSessionsSectionProps> = ({ 
  sessions,
  onTutorClick
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Previous Sessions</CardTitle>
        <Button variant="outline" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>You haven't had any sessions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div 
                key={session.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex gap-3">
                    <Avatar 
                      className="cursor-pointer" 
                      onClick={() => onTutorClick && onTutorClick(session.tutorId)}
                    >
                      <AvatarImage src={session.tutorPhoto} />
                      <AvatarFallback>{session.tutorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 
                        className="font-medium cursor-pointer hover:text-primary"
                        onClick={() => onTutorClick && onTutorClick(session.tutorId)}
                      >
                        {session.tutorName}
                      </h4>
                      <Badge variant="outline">{session.subject}</Badge>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{session.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{session.time} ({session.duration}h)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 md:ml-auto">
                    <Button 
                      variant={session.isRated ? "ghost" : "default"}
                      className={session.isRated ? "text-gray-500" : ""}
                      disabled={session.isRated}
                    >
                      <Star className="mr-2 h-4 w-4" /> 
                      {session.isRated ? "Rated" : "Rate Tutor"}
                    </Button>
                    <Button variant="outline">
                      <RotateCw className="mr-2 h-4 w-4" /> Rebook
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreviousSessionsSection;
