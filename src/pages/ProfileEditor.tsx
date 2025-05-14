
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Navigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import MultiSelect from "@/components/ui/multi-select";

const ProfileEditor = () => {
  const { user, role, profile, isLoading } = useAuth();
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [gradeLevel, setGradeLevel] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  // Mock skills for autocomplete
  const skillOptions = [
    "Python", "JavaScript", "React", "Node.js", "HTML", "CSS", "Java", 
    "C++", "Machine Learning", "Data Science", "SQL", "Math", "Physics",
    "Chemistry", "Biology", "History", "English", "Writing", "Public Speaking",
    "Graphic Design", "Marketing", "Excel", "Statistics"
  ];
  
  // Fetch profile data based on role
  useEffect(() => {
    if (user?.id && role) {
      const fetchProfileData = async () => {
        try {
          const table = role === 'tutor' ? 'tutor_profiles' : 'student_profiles';
          
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error(`Error fetching ${role} profile:`, error);
            return;
          }
          
          setProfileData(data);
          
          if (role === 'tutor') {
            setBio(data?.experience || '');
            setSkills(data?.subjects || []);
          } else {
            setGradeLevel(data?.grade_level || '');
            setSkills(data?.preferred_subjects || []);
          }
        } catch (err) {
          console.error('Error loading profile data:', err);
        }
      };
      
      fetchProfileData();
    }
  }, [user?.id, role]);
  
  const handleSaveProfile = async () => {
    if (!user?.id || !role) return;
    
    setIsSaving(true);
    try {
      const table = role === 'tutor' ? 'tutor_profiles' : 'student_profiles';
      
      let updateData = {};
      if (role === 'tutor') {
        updateData = {
          experience: bio,
          subjects: skills
        };
      } else {
        updateData = {
          grade_level: gradeLevel,
          preferred_subjects: skills
        };
      }
      
      const { error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <div className="mt-4 animate-pulse flex justify-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-1"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-1 animate-pulse delay-100"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-1 animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Determine user type - default to student if no role
  const userType = (role === 'tutor' || role === 'student') ? role : 'student';
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar userType={userType} />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          userName={profile?.full_name || user.email || 'User'} 
          userType={userType}
          userImage={profile?.profile_picture_url}
        />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {userType === 'tutor' ? (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About Me / Experience
                    </label>
                    <Textarea
                      placeholder="Tell students about your experience, teaching style, and expertise..."
                      className="min-h-[150px]"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills/Subjects You Teach
                    </label>
                    <MultiSelect
                      options={skillOptions}
                      value={skills}
                      onChange={setSkills}
                      placeholder="Add skills or subjects you can teach..."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <Input
                      placeholder="e.g. 10th Grade, College Freshman, etc."
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subjects You're Interested In
                    </label>
                    <MultiSelect
                      options={skillOptions}
                      value={skills}
                      onChange={setSkills}
                      placeholder="Add subjects you want to learn..."
                    />
                  </div>
                </>
              )}
              
              <Button 
                className="w-full md:w-auto"
                disabled={isSaving}
                onClick={handleSaveProfile}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
