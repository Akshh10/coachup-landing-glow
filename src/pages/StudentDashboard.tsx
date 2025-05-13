
import React from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WelcomeSection from "@/components/dashboard/student/WelcomeSection";
import UpcomingSessionsSection from "@/components/dashboard/student/UpcomingSessionsSection";
import PreviousSessionsSection from "@/components/dashboard/student/PreviousSessionsSection";
import RecommendedTutorsSection from "@/components/dashboard/student/RecommendedTutorsSection";

const StudentDashboard: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get("tab") || "dashboard";
  
  // Mock data
  const studentData = {
    name: "Alex Morgan",
    photo: "https://i.pravatar.cc/150?u=alexmorgan",
    upcomingSessions: 2,
    completedSessions: 8
  };
  
  const upcomingSessions = [
    {
      id: "1",
      tutorName: "Dr. Sarah Johnson",
      tutorPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
      subject: "Physics",
      date: "June 15, 2023",
      time: "3:00 PM - 4:00 PM",
      duration: 1
    },
    {
      id: "2",
      tutorName: "Prof. David Chen",
      tutorPhoto: "https://i.pravatar.cc/150?u=davidchen",
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
      tutorId: "1",
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
      tutorId: "2",
      subject: "Calculus",
      date: "May 25, 2023",
      time: "2:00 PM - 3:30 PM",
      duration: 1.5,
      isRated: false
    },
    {
      id: "3",
      tutorName: "Maria Rodriguez",
      tutorPhoto: "https://i.pravatar.cc/150?u=maria",
      tutorId: "3",
      subject: "Chemistry",
      date: "May 18, 2023",
      time: "4:00 PM - 5:00 PM",
      duration: 1,
      isRated: true
    }
  ];
  
  const recommendedTutors = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
      subjects: ["Physics", "Calculus", "Algebra", "Quantum Mechanics"],
      hourlyRate: 45,
      rating: 4.9,
      totalReviews: 124
    },
    {
      id: "2",
      name: "Prof. David Chen",
      photo: "https://i.pravatar.cc/150?u=davidchen",
      subjects: ["Calculus", "Algebra", "Statistics"],
      hourlyRate: 40,
      rating: 4.7,
      totalReviews: 98
    },
    {
      id: "3",
      name: "Maria Rodriguez",
      photo: "https://i.pravatar.cc/150?u=maria",
      subjects: ["Chemistry", "Biology", "Organic Chemistry"],
      hourlyRate: 42,
      rating: 4.8,
      totalReviews: 87
    }
  ];
  
  const renderContent = () => {
    switch (tab) {
      case "sessions":
        return (
          <div className="space-y-6">
            <UpcomingSessionsSection sessions={upcomingSessions} />
            <PreviousSessionsSection sessions={previousSessions} />
          </div>
        );
      case "find-tutors":
        return <RecommendedTutorsSection tutors={recommendedTutors} />;
      default:
        return (
          <div className="space-y-6">
            <WelcomeSection 
              studentName={studentData.name} 
              upcomingSessions={studentData.upcomingSessions}
              completedSessions={studentData.completedSessions}
            />
            <UpcomingSessionsSection sessions={upcomingSessions} />
            <RecommendedTutorsSection tutors={recommendedTutors} />
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
