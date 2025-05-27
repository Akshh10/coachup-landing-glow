import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WelcomeSection from "@/components/dashboard/student/WelcomeSection";
import UpcomingSessionsSection from "@/components/dashboard/student/UpcomingSessionsSection";
import PreviousSessionsSection from "@/components/dashboard/student/PreviousSessionsSection";
import RecommendedTutorsSection from "@/components/dashboard/student/RecommendedTutorsSection";
import { toast } from "@/components/ui/use-toast";

const StudentDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get("tab") || "dashboard";
  const { user, profile } = useAuth();
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      const fetchStudentData = async () => {
        try {
          setIsLoading(true);
          const [{ data: profileData }, { data: sessionsData }] = await Promise.all([
            supabase.from('student_profiles').select('*').eq('id', user.id).maybeSingle(),
            supabase.from('live_sessions').select('*').eq('student_id', user.id)
          ]);
          setStudentProfile(profileData);
          setSessions(sessionsData || []);
        } catch (err) {
          console.error('Dashboard load error:', err);
          setError('Failed to load dashboard');
        } finally {
          setIsLoading(false);
        }
      };

      fetchStudentData();
    }
  }, [user?.id]);

  const studentData = {
    name: profile?.full_name || 'New Student',
    photo: profile?.profile_picture_url || "",
    upcomingSessions: sessions.length,
    completedSessions: 0,
    preferredSubjects: studentProfile?.preferred_subjects || [],
    gradeLevel: studentProfile?.grade_level || 'Not specified',
    learningGoals: studentProfile?.learning_goals || [],
  };

  const handleTutorClick = (tutorId: string) => {
    navigate(`/tutor/${tutorId}`);
  };

  const handleSessionBooking = (tutorId: string) => {
    navigate(`/booking/${tutorId}`);
    toast({
      title: "Booking initiated",
      description: "You're being redirected to book a session with this tutor."
    });
  };

  const handleMessageTutor = (tutorId: string, tutorName: string) => {
    toast({
      title: "Message feature",
      description: `Opening chat with ${tutorName}. This feature will be available soon!`
    });
  };

  const handleJoinSession = async (sessionId: string) => {
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

  const renderEducationInfo = () => {
    if (studentProfile?.grade_level) {
      return (
        <div className="mb-4">
          <h3 className="font-medium text-gray-700">Academic Information</h3>
          <div className="mt-1 text-sm">
            <p><span className="font-medium">Grade Level:</span> {studentProfile.grade_level}</p>
            {studentProfile?.preferred_subjects?.length > 0 && (
              <p className="mt-1">
                <span className="font-medium">Subjects:</span> {studentProfile.preferred_subjects.join(', ')}</p>
            )}
          </div>
        </div>
      );
    } else if (studentProfile?.preferred_subjects?.length > 0) {
      return (
        <div className="mb-4">
          <h3 className="font-medium text-gray-700">Skills Interest</h3>
          <div className="mt-1 text-sm">
            <p>
              <span className="font-medium">Skills:</span> {studentProfile.preferred_subjects.join(', ')}
            </p>
            {studentProfile?.learning_goals && (
              <p className="mt-1">
                <span className="font-medium">Learning Goals:</span> {studentProfile.learning_goals}</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    switch (tab) {
      case "sessions":
        return (
          <div className="space-y-6">
            {renderEducationInfo()}
            <UpcomingSessionsSection 
              sessions={sessions} 
              onTutorClick={handleTutorClick}
              onJoinSession={handleJoinSession as any} // temp fix until prop is typed
            />
            <PreviousSessionsSection 
              sessions={[]} 
              onTutorClick={handleTutorClick}
            />
          </div>
        );
      case "find-tutors":
        return (
          <RecommendedTutorsSection 
            tutors={[]} 
            onTutorClick={handleTutorClick}
            onBookingClick={handleSessionBooking}
            onMessageClick={handleMessageTutor}
          />
        );
      default:
        return (
          <div className="space-y-6">
            <WelcomeSection 
              studentName={studentData.name} 
              upcomingSessions={studentData.upcomingSessions}
              completedSessions={studentData.completedSessions}
              gradeLevel={studentData.gradeLevel}
              preferredSubjects={studentData.preferredSubjects}
              learningGoals={studentData.learningGoals}
              onAddGoal={() => {}}
              onAddSubject={() => {}}
            />
            {renderEducationInfo()}
            <UpcomingSessionsSection 
              sessions={sessions} 
              onTutorClick={handleTutorClick} 
              onJoinSession={handleJoinSession as any} // temp fix until prop is typed
            />
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
      <DashboardSidebar userType="student" />
      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          userName={studentData.name} 
          userType="student" 
          userImage={studentData.photo} 
        />
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
