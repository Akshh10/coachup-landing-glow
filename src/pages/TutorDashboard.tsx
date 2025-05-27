import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileSection from "@/components/dashboard/tutor/ProfileSection";
import BookingsSection from "@/components/dashboard/tutor/BookingsSection";
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
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      const fetchTutorData = async () => {
        try {
          setIsLoading(true);
          const [{ data: profileData }, { data: sessionsData }] = await Promise.all([
            supabase.from('tutor_profiles').select('*').eq('id', user.id).maybeSingle(),
            supabase.from('live_sessions').select('*').eq('tutor_id', user.id)
          ]);
          setTutorProfile(profileData);
          setSessions(sessionsData || []);
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
    title: "Tutor",
    rating: 0,
    subjects: tutorProfile?.subjects || [],
    hourlyRate: tutorProfile?.hourly_rate || 0,
    bio: tutorProfile?.bio || "No bio available yet."
  };

  const handleStartSession = async (sessionId: string) => {
    const { data, error } = await supabase
      .from("live_sessions")
      .select("room_url")
      .eq("id", sessionId)
      .single();

    if (!data?.room_url) {
      toast({ title: "Session not ready", description: "Missing room." });
      return;
    }

    navigate(`/session?room=${encodeURIComponent(data.room_url)}`);
  };

  const renderContent = () => {
    switch (tab) {
      case "profile":
        return <ProfileSection profile={combinedProfile} />;
      case "bookings":
        return <BookingsSection bookings={sessions} onStartSession={handleStartSession} />;
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
            <BookingsSection bookings={sessions} onStartSession={handleStartSession} />
          </div>
        );
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
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
