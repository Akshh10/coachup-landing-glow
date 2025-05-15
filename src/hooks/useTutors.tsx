
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

interface Tutor {
  id: string;
  subjects?: string[];
  hourly_rate?: number;
  rating: number;
  total_reviews?: number;
  location?: string;
  experience?: string;
  full_name?: string;
}

// Interface for the raw tutor data from Supabase
interface RawTutorData {
  id: string;
  subjects?: string[];
  is_active?: boolean;
  experience?: string;
  location?: string;
  profiles: {
    id: string;
    full_name?: string;
  };
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
      return data;
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
      if (!userId || studentSubjects.length === 0) return [];

      // Query tutors whose subjects overlap with student's preferred subjects
      let query = supabase
        .from("tutor_profiles")
        .select(`
          id,
          subjects,
          is_active,
          experience,
          location,
          profiles(id, full_name)
        `)
        .eq("is_active", true)
        .overlaps("subjects", studentSubjects);

      const { data, error } = await query;

      if (error) throw error;

      // Map and transform the data
      // First cast to unknown and then to RawTutorData[] to work around the type mismatch
      const rawData = data as unknown as RawTutorData[];
      
      const mappedTutors: Tutor[] = rawData.map((tutor) => ({
        id: tutor.id,
        full_name: tutor.profiles?.full_name || "Unknown Tutor",
        subjects: tutor.subjects || [],
        hourly_rate: Math.floor(Math.random() * 40) + 20, // Placeholder
        rating: Number((Math.random() * 3 + 2).toFixed(1)), // Placeholder rating between 2-5
        total_reviews: Math.floor(Math.random() * 100), // Placeholder
        location: tutor.location || "Remote",
        experience: tutor.experience || "New Tutor",
      }));
      
      // If search term exists, filter client-side
      if (searchTerm) {
        return mappedTutors.filter(tutor => 
          tutor.subjects?.some(subject => 
            subject.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
      
      return mappedTutors;
    },
    enabled: !!userId && studentSubjects.length > 0,
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
