
import React from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import TutorHeader from "@/components/profile/TutorHeader";
import TutorBio from "@/components/profile/TutorBio";
import TutorDetails from "@/components/profile/TutorDetails";
import TutorAvailability from "@/components/profile/TutorAvailability";
import TutorReviews from "@/components/profile/TutorReviews";
import BookingCTA from "@/components/profile/BookingCTA";

const TutorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock data
  const tutor = {
    id: id || "1",
    name: "Dr. Sarah Johnson",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
    subjects: ["Physics", "Calculus", "Algebra", "Quantum Mechanics"],
    rating: 4.9,
    totalReviews: 124,
    isVerified: true,
    isTopRated: true,
    headline: "PhD in Theoretical Physics | 8+ Years Teaching Experience",
    bio: `I'm a passionate physics and mathematics educator with a PhD in Theoretical Physics from MIT. My teaching philosophy centers on building intuition and deep understanding, rather than rote memorization.

Over the past 8 years, I've helped hundreds of students achieve their academic goals, from high school physics to graduate-level quantum mechanics. I believe every student can excel in STEM subjects with the right guidance and support.

My sessions are interactive and tailored to your specific needs. We'll work through concepts, solve problems together, and develop strategies to help you succeed in your courses and beyond.`,
    details: {
      hourlyRate: 45,
      experience: 8,
      education: "PhD in Theoretical Physics, MIT",
      languages: ["English", "Spanish", "Mandarin"],
      totalSessions: 540,
      availability: "Weekdays, Some Weekends"
    },
    availableSlots: [
      {
        id: "1",
        date: new Date(),
        startTime: "3:00 PM",
        endTime: "4:00 PM"
      },
      {
        id: "2",
        date: new Date(),
        startTime: "5:00 PM",
        endTime: "6:00 PM"
      },
      {
        id: "3",
        date: new Date(Date.now() + 86400000), // tomorrow
        startTime: "2:00 PM",
        endTime: "3:00 PM"
      },
      {
        id: "4",
        date: new Date(Date.now() + 86400000 * 2), // day after tomorrow
        startTime: "4:00 PM",
        endTime: "5:00 PM"
      }
    ],
    reviews: [
      {
        id: "1",
        studentName: "Alex Johnson",
        studentPhoto: "https://i.pravatar.cc/150?u=alex",
        rating: 5,
        date: "May 20, 2023",
        comment: "Dr. Johnson's approach to explaining quantum mechanics was incredibly helpful. She broke down complex topics into manageable parts and was very patient with my questions.",
        subject: "Physics"
      },
      {
        id: "2",
        studentName: "Jessica Wang",
        studentPhoto: "https://i.pravatar.cc/150?u=jessica",
        rating: 5,
        date: "April 15, 2023",
        comment: "I was struggling with calculus for months before I found Sarah. Her teaching style is clear and she provides great examples. My grades improved from a C to an A-!",
        subject: "Calculus"
      },
      {
        id: "3",
        studentName: "Marcus Chen",
        studentPhoto: "https://i.pravatar.cc/150?u=marcus",
        rating: 4,
        date: "March 28, 2023",
        comment: "Very knowledgeable and patient tutor. Helped me prepare for my physics exam with great practice problems and explanations.",
        subject: "Physics"
      }
    ]
  };
  
  const handleBookSlot = (slotId: string) => {
    window.location.href = `/booking/${id}?slot=${slotId}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TutorHeader tutor={tutor} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TutorBio bio={tutor.bio} />
              <TutorDetails details={tutor.details} />
            </div>
            
            <TutorAvailability 
              availableSlots={tutor.availableSlots}
              onBookSlot={handleBookSlot}
            />
            
            <TutorReviews 
              reviews={tutor.reviews}
              averageRating={tutor.rating}
              totalReviews={tutor.totalReviews}
            />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <BookingCTA 
                hourlyRate={tutor.details.hourlyRate}
                tutorId={tutor.id}
                subjects={tutor.subjects}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
