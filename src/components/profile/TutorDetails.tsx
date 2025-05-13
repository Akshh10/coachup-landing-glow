
import React from "react";
import { Clock, Award, Calendar, GraduationCap, Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TutorDetailsProps {
  details: {
    hourlyRate: number;
    experience: number; // years
    education: string;
    languages: string[];
    totalSessions: number;
    availability: string; // e.g. "Weekdays, Evenings"
  };
}

const TutorDetails: React.FC<TutorDetailsProps> = ({ details }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-medium">Hourly Rate</h3>
            </div>
            <p className="text-2xl font-bold text-primary">${details.hourlyRate}</p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Award className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-medium">Experience</h3>
            </div>
            <p className="text-gray-700">{details.experience} years</p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-medium">Availability</h3>
            </div>
            <p className="text-gray-700">{details.availability}</p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <GraduationCap className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-medium">Education</h3>
            </div>
            <p className="text-gray-700">{details.education}</p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Languages className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-medium">Languages</h3>
            </div>
            <p className="text-gray-700">{details.languages.join(", ")}</p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-medium">Sessions Completed</h3>
            </div>
            <p className="text-gray-700">{details.totalSessions}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorDetails;
