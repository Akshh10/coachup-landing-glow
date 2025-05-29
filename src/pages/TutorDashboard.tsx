import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileSection from "@/components/dashboard/tutor/ProfileSection";
import UpcomingSessions from "@/components/dashboard/UpcomingSessions";
import AvailabilitySection from "@/components/dashboard/tutor/AvailabilitySection";
import ReviewsSection from "@/components/dashboard/tutor/ReviewsSection";
import EarningsSection from "@/components/dashboard/tutor/EarningsSection";
import { toast } from "@/components/ui/use-toast";

const TutorDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get("tab") || "dashboard";
  const { user, profile } = useAuth();
  const [tutorProfile, setTutorProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      const fetchTutorData = async () => {
        try {
          setIsLoading(true);
          const { data: profileData } = await supabase
            .from('tutor_profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          setTutorProfile(profileData);
        } catch (err) {
          console.error('Dashboard load error:', err);
          setError('Failed to load dashboard');
        } finally {
          setIsLoading(false);
        }
      };

      fetchTutorData();
    }
  }, [user?.id]);

  const combinedProfile = {
    name: profile?.full_name || 'New Tutor',
    photo: profile?.profile_picture_url || "",
    subjects: tutorProfile?.subjects || [],
    experience: tutorProfile?.experience || 'Not specified',
    hourlyRate: tutorProfile?.hourly_rate || 0,
    availability: tutorProfile?.availability || {},
  };

  const handleStartSession = async (sessionId: string) => {
    // Implement video call functionality here
    console.log('Starting session:', sessionId);
  };

  const renderContent = () => {
    switch (tab) {
      case "profile":
        return <ProfileSection profile={combinedProfile} />;
      case "bookings":
        return <UpcomingSessions userType="tutor" />;
      case "availability":
        return <AvailabilitySection timeSlots={[]} />;
      case "reviews":
        return <ReviewsSection reviews={[]} averageRating={4.8} totalReviews={0} />;
      case "earnings":
        return <EarningsSection earnings={{ currentMonth: 0, lastMonth: 0, totalEarnings: 0, pendingPayout: 0, recentTransactions: [] }} />;
      default:
        return (
          <div className="space-y-6">
            <ProfileSection profile={combinedProfile} />
            <UpcomingSessions userType="tutor" />
          </div>
        );
    }
  };

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
