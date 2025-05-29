import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BookingForm from "@/components/booking/BookingForm";
import { Button } from "@/components/ui/button";

const BookingPage: React.FC = () => {
  const { tutorId } = useParams<{ tutorId: string }>();
  
  // Mock tutor data
  const tutor = {
    id: tutorId || "1",
    name: "Dr. Sarah Johnson",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
    subjects: ["Physics", "Calculus", "Algebra", "Quantum Mechanics"],
    hourlyRate: 45
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link to={`/tutor/${tutorId}`} className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to tutor profile
          </Link>
        </div>
        
        <BookingForm 
          tutorName={tutor.name}
          tutorPhoto={tutor.photo}
          subjects={tutor.subjects}
          hourlyRate={tutor.hourlyRate}
          tutorId={tutor.id}
        />
        
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-4">
            Need help with booking? Contact our support team.
          </p>
          <Button variant="outline">Contact Support</Button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
