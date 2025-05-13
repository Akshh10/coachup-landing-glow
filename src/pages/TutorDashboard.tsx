
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileSection from "@/components/dashboard/tutor/ProfileSection";
import BookingsSection from "@/components/dashboard/tutor/BookingsSection";
import AvailabilitySection from "@/components/dashboard/tutor/AvailabilitySection";
import ReviewsSection from "@/components/dashboard/tutor/ReviewsSection";
import EarningsSection from "@/components/dashboard/tutor/EarningsSection";

const TutorDashboard: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get("tab") || "dashboard";
  
  // Mock data
  const tutorProfile = {
    name: "Dr. Sarah Johnson",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
    title: "Physics & Mathematics Tutor",
    rating: 4.9,
    subjects: ["Physics", "Calculus", "Algebra", "Quantum Mechanics"],
    hourlyRate: 45,
    bio: "PhD in Theoretical Physics with 8+ years of teaching experience. I specialize in making complex concepts easy to understand and helping students build confidence in their abilities."
  };
  
  const bookings = [
    {
      id: "1",
      studentName: "Michael Thompson",
      studentPhoto: "https://i.pravatar.cc/150?u=michael",
      subject: "Physics",
      date: "June 15, 2023",
      time: "3:00 PM - 4:00 PM",
      status: "upcoming",
      duration: 1
    },
    {
      id: "2",
      studentName: "Emma Davis",
      studentPhoto: "https://i.pravatar.cc/150?u=emma",
      subject: "Calculus",
      date: "June 16, 2023",
      time: "5:00 PM - 6:30 PM",
      status: "upcoming",
      duration: 1.5
    }
  ];
  
  const timeSlots = [
    { id: "1", day: "Monday", startTime: "9:00 AM", endTime: "12:00 PM" },
    { id: "2", day: "Monday", startTime: "2:00 PM", endTime: "6:00 PM" },
    { id: "3", day: "Wednesday", startTime: "10:00 AM", endTime: "4:00 PM" },
    { id: "4", day: "Friday", startTime: "1:00 PM", endTime: "5:00 PM" }
  ];
  
  const reviews = [
    {
      id: "1",
      studentName: "Alex Johnson",
      studentPhoto: "https://i.pravatar.cc/150?u=alex",
      rating: 5,
      comment: "Dr. Johnson's approach to explaining quantum mechanics was incredibly helpful. She broke down complex topics into manageable parts and was very patient with my questions.",
      date: "May 20, 2023",
      subject: "Physics"
    },
    {
      id: "2",
      studentName: "Jessica Wang",
      studentPhoto: "https://i.pravatar.cc/150?u=jessica",
      rating: 5,
      comment: "I was struggling with calculus for months before I found Sarah. Her teaching style is clear and she provides great examples. My grades improved from a C to an A-!",
      date: "April 15, 2023",
      subject: "Calculus"
    },
    {
      id: "3",
      studentName: "Marcus Chen",
      studentPhoto: "https://i.pravatar.cc/150?u=marcus",
      rating: 4,
      comment: "Very knowledgeable and patient tutor. Helped me prepare for my physics exam with great practice problems and explanations.",
      date: "March 28, 2023",
      subject: "Physics"
    }
  ];
  
  const earnings = {
    currentMonth: 1250,
    lastMonth: 980,
    totalEarnings: 8700,
    pendingPayout: 450,
    recentTransactions: [
      {
        id: "1",
        date: "June 10, 2023",
        studentName: "Michael Thompson",
        amount: 45,
        status: "completed"
      },
      {
        id: "2",
        date: "June 5, 2023",
        studentName: "Emma Davis",
        amount: 67.50,
        status: "completed"
      },
      {
        id: "3",
        date: "June 2, 2023",
        studentName: "Alex Johnson",
        amount: 45,
        status: "completed"
      }
    ]
  };
  
  const renderContent = () => {
    switch (tab) {
      case "profile":
        return <ProfileSection profile={tutorProfile} />;
      case "bookings":
        return <BookingsSection bookings={bookings} />;
      case "availability":
        return <AvailabilitySection timeSlots={timeSlots} />;
      case "reviews":
        return <ReviewsSection 
                reviews={reviews}
                averageRating={4.8}
                totalReviews={reviews.length}
               />;
      case "earnings":
        return <EarningsSection earnings={earnings} />;
      default:
        return (
          <div className="space-y-6">
            <ProfileSection profile={tutorProfile} />
            <BookingsSection bookings={bookings} />
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar userType="tutor" />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          userName={tutorProfile.name} 
          userType="tutor" 
          userImage={tutorProfile.photo}
        />
        
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
