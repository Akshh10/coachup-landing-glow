
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

// Import refactored components
import SearchBar from "@/components/tutors/SearchBar";
import SubjectFilters from "@/components/tutors/SubjectFilters";
import TutorGrid from "@/components/tutors/TutorGrid";
import EmptyState from "@/components/tutors/EmptyState";
import { useTutors } from "@/hooks/useTutors";
import { toast } from "@/components/ui/use-toast";

const MyTutors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    tutors,
    searchTerm,
    setSearchTerm,
    studentSubjects,
    isLoading,
    error
  } = useTutors(user?.id);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleViewProfile = (tutorId: string) => {
    navigate(`/tutor/${tutorId}`);
  };

  const handleBookSession = (tutorId: string) => {
    // Show toast to inform user
    toast({
      title: "Booking initiated",
      description: "You're being redirected to the booking page.",
    });
    
    navigate(`/tutor/${tutorId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar userType="student" />
        <div className="flex-1 flex flex-col">
          <DashboardHeader
            userName=""
            userType="student"
            userImage=""
          />
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Loading tutors...</h2>
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar userType="student" />
        <div className="flex-1 flex flex-col">
          <DashboardHeader
            userName=""
            userType="student"
            userImage=""
          />
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
              <p className="text-gray-600">
                {(error as Error)?.message || "Failed to load tutors"}
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar userType="student" />
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          userName=""
          userType="student"
          userImage=""
        />
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Find Tutors</h1>
              <p className="text-gray-600">
                Discover tutors who specialize in your preferred subjects
              </p>
            </div>

            {/* Search bar */}
            <SearchBar 
              value={searchTerm} 
              onChange={handleSearchChange} 
            />

            {/* Subject pills for quick filtering */}
            <SubjectFilters 
              subjects={studentSubjects}
              onSelectSubject={setSearchTerm}
            />

            {/* Tutors grid or empty state */}
            {tutors && tutors.length > 0 ? (
              <TutorGrid 
                tutors={tutors} 
                onViewProfile={handleViewProfile}
                onBookSession={handleBookSession}
              />
            ) : (
              <EmptyState 
                searchTerm={searchTerm}
                hasSubjects={studentSubjects.length > 0}
                onClearSearch={() => setSearchTerm("")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTutors;
