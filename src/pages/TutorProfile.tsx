import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import TutorHeader from "@/components/profile/TutorHeader";
import TutorBio from "@/components/profile/TutorBio";
import TutorDetails from "@/components/profile/TutorDetails";
import TutorAvailability from "@/components/profile/TutorAvailability";
import TutorReviews from "@/components/profile/TutorReviews";
import BookingCTA from "@/components/profile/BookingCTA";
import { supabase } from "@/integrations/supabase/client"; // Import supabase client

// Define a type for the tutor data structure based on your Supabase table
interface TutorProfileData {
  id: string;
  full_name: string | null;
  profile_picture_url: string | null;
  subjects: string[] | null;
  rating: number | null;
  total_reviews: number | null;
  is_verified: boolean | null;
  is_top_rated: boolean | null;
  headline: string | null;
  bio: string | null;
  hourly_rate: number | null;
  experience: number | null; // years
  education: string | null;
  languages: string[] | null;
  total_sessions_completed: number | null;
  availability: string | null; // e.g. "Weekdays, Evenings"
}

const TutorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tutor, setTutor] = useState<TutorProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Tutor ID is missing.");
      setIsLoading(false);
      return;
    }

    const fetchTutor = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('tutor_profiles') // Assuming your tutor data is in a 'tutor_profiles' table
          .select('*')
          .eq('id', id)
          .single(); // Use single() to get a single record

        if (error) {
          console.error("Error fetching tutor:", error);
          setError("Failed to load tutor profile.");
          toast.error("Failed to load tutor profile.");
        } else {
          setTutor(data as TutorProfileData); // Cast data to the defined type
        }
      } catch (err) {
        console.error("An unexpected error occurred:", err);
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutor();
  }, [id]); // Rerun effect if id changes

  const handleBookSlot = (slotId: string) => {
    window.location.href = `/booking/${id}?slot=${slotId}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TutorHeader tutor={tutor} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TutorBio bio={tutor?.bio} />
              <TutorDetails details={tutor} />
            </div>
            
          
            
            <TutorReviews 
              reviews={[]}
              averageRating={tutor?.rating || 0}
              totalReviews={tutor?.total_reviews || 0}
            />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <BookingCTA 
                hourlyRate={tutor?.hourly_rate || 0}
                tutorId={tutor?.id || ""}
                subjects={tutor?.subjects || []}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
