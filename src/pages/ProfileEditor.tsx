
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const ProfileEditor = () => {
  const { user, profile, role, isLoading } = useAuth();
  
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
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar userType={role || 'student'} />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          userName={profile?.full_name || 'User'} 
          userType={role || 'student'} 
          userImage={profile?.profile_picture_url}
        />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">
                Profile editing functionality will be implemented here.
              </p>
              {/* Profile editing form will be added here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
