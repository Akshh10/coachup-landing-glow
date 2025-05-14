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

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const App = () => {
  const { user, role } = useAuth(); // Fetch user and role from custom hook

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

              {/* Protected Routes */}
              <Route
                path="/tutor-dashboard"
                element={
                  user && role === "tutor" ? (
                    <TutorDashboard />
                  ) : (
                    <Navigate to="/signup" />
                  )
                }
              />
              <Route
                path="/student-dashboard"
                element={
                  user && role === "student" ? (
                    <StudentDashboard />
                  ) : (
                    <Navigate to="/signup" />
                  )
                }
              />
              <Route
                path="/tutor/:id"
                element={
                  user && role === "tutor" ? (
                    <TutorProfile />
                  ) : (
                    <Navigate to="/signup" />
                  )
                }
              />
              <Route
                path="/booking/:tutorId"
                element={
                  user ? (
                    <BookingPage />
                  ) : (
                    <Navigate to="/signup" />
                  )
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
