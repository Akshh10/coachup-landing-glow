
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TutorDashboard from "./pages/TutorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TutorProfile from "./pages/TutorProfile";
import BookingPage from "./pages/BookingPage";
import SignUp from "./pages/SignUp";
import { useAuth } from "@/hooks/useAuth";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AuthCallback from "./pages/Auth/AuthCallback";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode; 
  requiredRole?: string 
}) => {
  const { user, role, isLoading } = useAuth();
  
  // Show loading indicator while checking authentication
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
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role
  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard'} replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Protected Routes */}
              <Route
                path="/tutor-dashboard"
                element={
                  <ProtectedRoute requiredRole="tutor">
                    <TutorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student-dashboard"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tutor/:id"
                element={
                  <ProtectedRoute>
                    <TutorProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking/:tutorId"
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
