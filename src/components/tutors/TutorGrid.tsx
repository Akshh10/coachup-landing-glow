
import React from "react";
import TutorCard from "./TutorCard";

interface Tutor {
  id: string;
  profile_picture_url?: string;
  full_name?: string;
  subjects?: string[];
  hourly_rate?: number;
  rating: number;
  total_reviews?: number;
  location?: string;
  experience?: string;
}

interface TutorGridProps {
  tutors: Tutor[];
  onViewProfile: (id: string) => void;
  onBookSession: (id: string) => void;
}

const TutorGrid: React.FC<TutorGridProps> = ({ tutors, onViewProfile, onBookSession }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tutors.map((tutor) => (
        <TutorCard
          key={tutor.id}
          tutor={tutor}
          onViewProfile={onViewProfile}
          onBookSession={onBookSession}
        />
      ))}
    </div>
  );
};

export default TutorGrid;
