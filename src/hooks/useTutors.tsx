import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

interface StudentProfile {
  id: string;
  preferred_subjects?: string[];
}

interface Tutor {
  id: string;
  profile_picture_url?: string;
  full_name?: string;
  subjects?: string[];
  hourly_rate?: number;
  rating: number;
  total_reviews?: number;
  location?: string;
  experience?: string;
}

export const useTutors = (userId: string | undefined) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [studentSubjects, setStudentSubjects] = useState<string[]>([]);

  // Fetch the student's profile to get their preferred subjects
  const {
    data: studentProfile,
    isLoading: isLoadingProfile,
    error: studentError,
  } = useQuery({
    queryKey: ["studentProfile", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("student_profiles")
        .select("preferred_subjects")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      return data as StudentProfile;
    },
    enabled: !!userId,
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
        const subjectsFilter = studentSubjects.join(" | ");
        query = query.textSearch("subjects", subjectsFilter, {
          type: "plain",
          config: "english",
        });
      }

      const { data, error } = await query;

      if (error) throw error;

      // Map and transform the data
      return (data || []).map((tutor: any) => ({
        id: tutor.id,
        profile_picture_url: tutor.profiles?.profile_picture_url || undefined,
        full_name: tutor.profiles?.full_name || "Unknown Tutor",
        subjects: tutor.subjects || [],
        hourly_rate: Math.floor(Math.random() * 40) + 20, // Placeholder
        rating: Number((Math.random() * 3 + 2).toFixed(1)), // Convert to number
        total_reviews: Math.floor(Math.random() * 100), // Placeholder
        location: tutor.location,
        experience: tutor.experience,
      })) as Tutor[];
    },
    enabled: !!userId,
  });

  return {
    tutors,
    searchTerm,
    setSearchTerm,
    studentSubjects,
    isLoading: isLoadingProfile || isLoadingTutors,
    error: studentError || tutorsError,
  };
};
