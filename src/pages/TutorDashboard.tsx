
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from "@/hooks/useAuth";
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
  const { user, profile } = useAuth();
  const [tutorProfile, setTutorProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tutor's specific profile data
  useEffect(() => {
    if (user?.id) {
      const fetchTutorProfile = async () => {
        try {
          setIsLoading(true);
          
          // Fetch tutor profile data
          const { data, error } = await supabase
            .from('tutor_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching tutor profile:', error);
            setError('Failed to load your tutor profile');
            return;
          }

          setTutorProfile(data);
        } catch (err) {
          console.error('Error in tutor dashboard:', err);
          setError('An unexpected error occurred');
        } finally {
          setIsLoading(false);
        }
      };

      fetchTutorProfile();
    }
  }, [user?.id]);

  // Combine auth profile with tutor profile
  const combinedProfile = {
    name: profile?.full_name || 'New Tutor',
    photo: profile?.profile_picture_url || "",
    title: "Tutor",
    rating: 0, // This should come from a ratings table
    subjects: tutorProfile?.subjects || [],
    hourlyRate: 45, // This should come from pricing table or tutor profile
    bio: tutorProfile?.experience || "No bio available yet."
  };
  
  // Mock data for now - replace with real data from Supabase in future
  const bookings = [
    {
      id: "1",
      studentName: "Michael Thompson",
      studentPhoto: "https://i.pravatar.cc/150?u=michael",
      subject: "Physics",
      date: "June 15, 2023",
      time: "3:00 PM - 4:00 PM",
      status: "upcoming" as const,
      duration: 1
    },
    {
      id: "2",
      studentName: "Emma Davis",
      studentPhoto: "https://i.pravatar.cc/150?u=emma",
      subject: "Calculus",
      date: "June 16, 2023",
      time: "5:00 PM - 6:30 PM",
      status: "upcoming" as const,
      duration: 1.5
    }
  ];
  
  // Parse availability from tutor profile or use default
  const timeSlots = tutorProfile?.availability 
    ? Object.entries(tutorProfile.availability).map(([day, slots], index) => ({
        id: index.toString(),
        day,
        startTime: slots.start,
        endTime: slots.end,
      }))
    : [
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
      comment: "Dr. Johnson's approach to explaining quantum mechanics was incredibly helpful.",
      date: "May 20, 2023",
      subject: "Physics"
    },
    {
      id: "2",
      studentName: "Jessica Wang",
      studentPhoto: "https://i.pravatar.cc/150?u=jessica",
      rating: 5,
      comment: "I was struggling with calculus for months before I found this tutor.",
      date: "April 15, 2023",
      subject: "Calculus"
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
        status: "completed" as const
      },
      {
        id: "2",
        date: "June 5, 2023",
        studentName: "Emma Davis",
        amount: 67.50,
        status: "completed" as const
      }
    ]
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading your dashboard...</h2>
          <div className="mt-4 animate-pulse flex justify-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-1"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-1 animate-pulse delay-100"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-1 animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }
  
  const renderContent = () => {
    switch (tab) {
      case "profile":
        return <ProfileSection profile={combinedProfile} />;
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
            <ProfileSection profile={combinedProfile} />
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
          userName={combinedProfile.name} 
          userType="tutor" 
          userImage={combinedProfile.photo}
        />
        
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
