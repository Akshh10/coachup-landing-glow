
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch student's specific profile data
  useEffect(() => {
    if (user?.id) {
      const fetchStudentProfile = async () => {
        try {
          setIsLoading(true);
          
          // Fetch student profile data
          const { data, error } = await supabase
            .from('student_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching student profile:', error);
            setError('Failed to load your student profile');
            return;
          }

          setStudentProfile(data);
        } catch (err) {
          console.error('Error in student dashboard:', err);
          setError('An unexpected error occurred');
        } finally {
          setIsLoading(false);
        }
      };

      fetchStudentProfile();
    }
  }, [user?.id]);

  // Student data from profile
  const studentData = {
    name: profile?.full_name || 'New Student',
    photo: profile?.profile_picture_url || "",
    upcomingSessions: 2,
    completedSessions: 8,
    preferredSubjects: studentProfile?.preferred_subjects || [],
    gradeLevel: studentProfile?.grade_level || 'Not specified',
    learningGoals: studentProfile?.learning_goals || 'Not specified'
  };
  
  // Simulated tutor IDs to connect with profile pages
  const tutorIds = ["tutor-1", "tutor-2"]; 
  
  // Mock data for now - replace with real data from Supabase in future
  const upcomingSessions = [
    {
      id: "1",
      tutorName: "Dr. Sarah Johnson",
      tutorPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
      tutorId: tutorIds[0],
      subject: "Physics",
      date: "June 15, 2023",
      time: "3:00 PM - 4:00 PM",
      duration: 1
    },
    {
      id: "2",
      tutorName: "Prof. David Chen",
      tutorPhoto: "https://i.pravatar.cc/150?u=davidchen",
      tutorId: tutorIds[1],
      subject: "Calculus",
      date: "June 18, 2023",
      time: "2:00 PM - 3:30 PM",
      duration: 1.5
    }
  ];
  
  const previousSessions = [
    {
      id: "1",
      tutorName: "Dr. Sarah Johnson",
      tutorPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
      tutorId: tutorIds[0],
      subject: "Physics",
      date: "June 1, 2023",
      time: "3:00 PM - 4:00 PM",
      duration: 1,
      isRated: true
    },
    {
      id: "2",
      tutorName: "Prof. David Chen",
      tutorPhoto: "https://i.pravatar.cc/150?u=davidchen",
      tutorId: tutorIds[1],
      subject: "Calculus",
      date: "May 25, 2023",
      time: "2:00 PM - 3:30 PM",
      duration: 1.5,
      isRated: false
    }
  ];
  
  const recommendedTutors = [
    {
      id: tutorIds[0],
      name: "Dr. Sarah Johnson",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
      subjects: ["Physics", "Calculus", "Algebra", "Quantum Mechanics"],
      hourlyRate: 45,
      rating: 4.9,
      totalReviews: 124
    },
    {
      id: tutorIds[1],
      name: "Prof. David Chen",
      photo: "https://i.pravatar.cc/150?u=davidchen",
      subjects: ["Calculus", "Algebra", "Statistics"],
      hourlyRate: 40,
      rating: 4.7,
      totalReviews: 98
    }
  ];
  
  const handleTutorClick = (tutorId: string) => {
    navigate(`/tutor-profile/${tutorId}`);
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
  
  // Display academic or skills information based on what's available
  const renderEducationInfo = () => {
    if (studentProfile?.grade_level) {
      return (
        <div className="mb-4">
          <h3 className="font-medium text-gray-700">Academic Information</h3>
          <div className="mt-1 text-sm">
            <p><span className="font-medium">Grade Level:</span> {studentProfile.grade_level}</p>
            {studentProfile?.preferred_subjects?.length > 0 && (
              <p className="mt-1">
                <span className="font-medium">Subjects:</span> {studentProfile.preferred_subjects.join(', ')}
              </p>
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
                <span className="font-medium">Learning Goals:</span> {studentProfile.learning_goals}
              </p>
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
            <UpcomingSessionsSection 
              sessions={upcomingSessions} 
              onTutorClick={handleTutorClick}
            />
            <PreviousSessionsSection 
              sessions={previousSessions} 
              onTutorClick={handleTutorClick}
            />
          </div>
        );
      case "find-tutors":
        return (
          <RecommendedTutorsSection 
            tutors={recommendedTutors} 
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
            />
            {renderEducationInfo()}
            <UpcomingSessionsSection 
              sessions={upcomingSessions}
              onTutorClick={handleTutorClick}
            />
            <RecommendedTutorsSection 
              tutors={recommendedTutors.slice(0, 2)} 
              onTutorClick={handleTutorClick}
              onBookingClick={handleSessionBooking}
              onMessageClick={handleMessageTutor}
            />
          </div>
        );
    }
  };
  
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
