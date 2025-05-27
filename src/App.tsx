import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TutorDashboard from "./pages/TutorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TutorProfile from "./pages/TutorProfile";
import BookingPage from "./pages/BookingPage";
import LiveSession from "./pages/LiveSession";
import { useAuth } from "@/hooks/useAuth";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AuthCallback from "./pages/Auth/AuthCallback";
import ProfileEditor from "./pages/ProfileEditor";
import TutorOnboarding from "./components/onboarding/TutorOnboarding";
import StudentOnboarding from "./components/onboarding/StudentOnboarding";
import RoleSelectDialog from "./pages/Auth/RoleSelectDialog";
import Skills from "./pages/Skills";
import Insights from "./pages/Insights";
import MyTutors from "./pages/MyTutors";

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

const RedirectToDashboard = () => {
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

  if (user && role) {
    return <Navigate to={role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard'} replace />;
  }
  
  return <Index />;
};

const App = () => {
  const { user, isLoading } = useAuth();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes with automatic redirect for logged in users */}
            <Route path="/" element={user ? <RedirectToDashboard /> : <Index />} />
            <Route path="/login" element={
              user ? <Navigate to="/auth/callback" replace /> : <Login />
            } />
            <Route path="/register" element={
              user ? <Navigate to="/auth/callback" replace /> : <Register />
            } />
            <Route path="/signup" element={<Navigate to="/register" replace />} />
            
            {/* Auth and Onboarding Routes */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route 
              path="/role-select" 
              element={
                !user ? <Navigate to="/login" replace /> : <RoleSelectDialog />
              }
            />
            
            <Route 
              path="/tutor-onboarding" 
              element={
                !user ? <Navigate to="/login" replace /> : 
                  <TutorOnboarding />
              }
            />
            
            <Route 
              path="/student-onboarding" 
              element={
                !user ? <Navigate to="/login" replace /> : 
                  <StudentOnboarding />
              }
            />

            {/* Content Pages */}
            <Route path="/skills" element={<Skills />} />
            <Route path="/insights" element={<Insights />} />

            {/* Protected Routes */}
            <Route
              path="/tutor-dashboard/*"
              element={
                <ProtectedRoute requiredRole="tutor">
                  <TutorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-dashboard/*"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileEditor />
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
            <Route
              path="/my-tutors"
              element={
                <ProtectedRoute requiredRole="student">
                  <MyTutors />
                </ProtectedRoute>
              }
            />
            <Route path="/session" element={<LiveSession />} />

            {/* Catch-All Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
