
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Navigate } from "react-router-dom";

const ProfileEditor = () => {
  const { user, role, isLoading } = useAuth();
  
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
          userName={user.email || 'User'} 
          userType={userType} 
        />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
            <p>Profile editor content will go here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
