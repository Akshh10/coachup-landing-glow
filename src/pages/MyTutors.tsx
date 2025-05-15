
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "@/components/ui/use-toast";

// Define types for our data structures
interface Tutor {
  id: string;
  profile_picture_url?: string;
  full_name?: string;
  subjects?: string[];
  hourly_rate?: number;
  rating: number; // This is a number in the interface
  total_reviews?: number;
  location?: string;
  experience?: string;
}

interface StudentProfile {
  id: string;
  preferred_subjects?: string[];
}

const MyTutors = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [studentSubjects, setStudentSubjects] = useState<string[]>([]);

  // Fetch the student's profile to get their preferred subjects
  const {
    data: studentProfile,
    isLoading: isLoadingProfile,
    error: studentError,
  } = useQuery({
    queryKey: ["studentProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("student_profiles")
        .select("preferred_subjects")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as StudentProfile;
    },
    enabled: !!user?.id,
  });

  // Set student subjects when profile data is available
  useEffect(() => {
    if (studentProfile?.preferred_subjects?.length) {
      setStudentSubjects(studentProfile.preferred_subjects);
    }
  }, [studentProfile]);

  // Fetch tutors data, incorporating student's subjects and search term
  const {
    data: tutors,
    isLoading: isLoadingTutors,
    error: tutorsError,
  } = useQuery({
    queryKey: ["tutors", studentSubjects, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("tutor_profiles")
        .select(
          `
          id,
          subjects,
          is_active,
          experience,
          location,
          profiles(id, full_name, profile_picture_url)
        `
        )
        .eq("is_active", true);

      if (searchTerm) {
        // If there's a search term, use it to filter tutors
        query = query.textSearch("subjects", searchTerm, {
          type: "plain",
          config: "english",
        });
      } else if (studentSubjects.length > 0) {
        // Otherwise, use student's preferred subjects
        // This is a simplification, in a real app you'd want to match any of the subjects
        const subjectsFilter = studentSubjects.join(" | ");
        query = query.textSearch("subjects", subjectsFilter, {
          type: "plain",
          config: "english",
        });
      }

      const { data, error } = await query;

      if (error) throw error;

      // Map and transform the data - fixing the type conversion and access issues
      return (data || []).map((tutor) => ({
        id: tutor.id,
        profile_picture_url: tutor.profiles ? tutor.profiles.profile_picture_url : undefined,
        full_name: tutor.profiles ? tutor.profiles.full_name : "Unknown Tutor",
        subjects: tutor.subjects || [],
        hourly_rate: Math.floor(Math.random() * 40) + 20, // Placeholder
        rating: Number((Math.random() * 3 + 2).toFixed(1)), // Convert to number
        total_reviews: Math.floor(Math.random() * 100), // Placeholder
        location: tutor.location,
        experience: tutor.experience,
      })) as Tutor[]; // This explicit cast ensures compatibility
    },
    enabled: !!user?.id,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleViewProfile = (tutorId: string) => {
    navigate(`/tutor/${tutorId}`);
  };

  const handleBookSession = (tutorId: string) => {
    navigate(`/booking/${tutorId}`);
  };

  // Loading state
  if (isLoadingProfile || isLoadingTutors) {
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
  if (studentError || tutorsError) {
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
                {(studentError as Error)?.message || (tutorsError as Error)?.message || "Failed to load tutors"}
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
              <h1 className="text-2xl font-bold mb-2">My Tutors</h1>
              <p className="text-gray-600">
                Find tutors who match your learning needs
              </p>
            </div>

            {/* Search bar */}
            <div className="mb-8 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search for subjects or tutors..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Subject pills for quick filtering */}
            {studentSubjects.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {studentSubjects.map((subject) => (
                  <Badge 
                    key={subject}
                    variant="outline" 
                    className="bg-white cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSearchTerm(subject)}
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
            )}

            {/* Tutors grid */}
            {tutors && tutors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutors.map((tutor) => (
                  <Card key={tutor.id} className="hover-card overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <Avatar className="h-16 w-16 mr-4">
                            <AvatarImage src={tutor.profile_picture_url} />
                            <AvatarFallback>{tutor.full_name?.charAt(0) || "T"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{tutor.full_name}</h3>
                            <div className="flex items-center mt-1">
                              <Star size={16} className="text-yellow-400 mr-1" />
                              <span className="text-sm font-medium">{tutor.rating}</span>
                              <span className="text-sm text-gray-500 ml-1">
                                ({tutor.total_reviews} reviews)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Subjects */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1 mt-2">
                            {tutor.subjects?.slice(0, 3).map((subject) => (
                              <Badge key={subject} variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                                {subject}
                              </Badge>
                            ))}
                            {tutor.subjects && tutor.subjects.length > 3 && (
                              <Badge variant="outline" className="bg-gray-50 text-gray-600">
                                +{tutor.subjects.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Rate */}
                        <div className="mb-4">
                          <p className="text-lg font-semibold text-green-600">${tutor.hourly_rate}/hour</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleViewProfile(tutor.id)}
                          >
                            View Profile
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={() => handleBookSession(tutor.id)}
                          >
                            Book Session
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-700 mb-2">No tutors found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm 
                    ? `No tutors found matching "${searchTerm}"`
                    : "No tutors match your preferred subjects yet"
                  }
                </p>
                {searchTerm && (
                  <Button onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTutors;
