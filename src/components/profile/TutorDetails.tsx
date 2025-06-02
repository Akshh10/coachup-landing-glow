import React from "react";
import { Clock, Award, Calendar, GraduationCap, Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TutorDetailsProps {
  details: {
    hourly_rate: number | null;
    experience: number | null;
    education: string | null;
    languages: string[] | null;
    total_sessions_completed: number | null;
    availability: string | object | null;
  } | null;
}

const TutorDetails: React.FC<TutorDetailsProps> = ({ details }) => {
  // Helper function to format availability
  const formatAvailability = (availability: string | object | null) => {
    if (!availability) {
      return 'N/A';
    }
    if (typeof availability === 'string') {
      return availability;
    }
    // Assuming it's an object like { Monday: true, Wednesday: true }
    if (typeof availability === 'object') {
      const availableDays = Object.keys(availability).filter(key => (availability as any)[key]);
      return availableDays.length > 0 ? availableDays.join(', ') : 'N/A';
    }
    return 'N/A';
  };

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
            <p className="text-2xl font-bold text-primary">${details?.hourly_rate || 'N/A'}</p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Award className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-medium">Experience</h3>
            </div>
            <p className="text-gray-700">{details?.experience ?? 'N/A'} years</p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-medium">Availability</h3>
            </div>
            <p className="text-gray-700">{formatAvailability(details?.availability)}</p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <GraduationCap className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-medium">Education</h3>
            </div>
            <p className="text-gray-700">{details?.education || 'N/A'}</p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Languages className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-medium">Languages</h3>
            </div>
            <p className="text-gray-700">{details?.languages?.join(", ") || 'N/A'}</p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-medium">Sessions Completed</h3>
            </div>
            <p className="text-gray-700">{details?.total_sessions_completed ?? 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorDetails;
