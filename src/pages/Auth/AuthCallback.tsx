import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

// Key for localStorage to communicate verification status
const VERIFICATION_STORAGE_KEY = 'upskill_email_verified';
// Get the registration data key name from Register component
const REGISTRATION_STORAGE_KEY = 'upskill_registration_data';

const AuthCallback = () => {
  const { user, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [justVerified, setJustVerified] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user || isLoading) return;

      try {
        console.log("Checking user status for role:", role);
        
        // Get the user auth metadata to check if this is a brand new sign-up
        const { data: userData } = await supabase.auth.getUser();
        const isNewUser = userData?.user?.app_metadata?.is_new_user || false;
        const isEmailVerified = userData?.user?.email_confirmed_at != null;
        
        console.log("Is new user:", isNewUser);
        console.log("Email verified:", isEmailVerified);
        
        setEmailVerified(isEmailVerified);
        
        // If email is not verified, stop here
        if (!isEmailVerified) {
          console.log("Email not verified, showing verification message");
          return;
        }

        // Check URL parameters to see if we just completed verification
        const urlParams = new URLSearchParams(window.location.search);
        const isSignupFlow = urlParams.has('type') && urlParams.get('type') === 'signup';
        
        if (isSignupFlow) {
          // For verification links from email, show success message

          // Notify the original tab about verification success
          try {
            localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify({
              email: user.email,
              verified: true,
              timestamp: new Date().toISOString()
            }));
            console.log('Stored verification status in localStorage for:', user.email);
          } catch (e) {
            console.error('Error handling localStorage:', e);
          }
          
          // Show success message in this verification tab
          setJustVerified(true);
          console.log("Email just verified, showing success message");
          
          // Start redirection countdown
          setRedirecting(true);
          
          // Set initial countdown to 10 seconds to give users time to read instructions
          setCountdown(10);
          
          // Determine which onboarding page to redirect to
          let redirectPath = '/role-select';
          if (role === 'tutor') {
            redirectPath = '/tutor-onboarding';
          } else if (role === 'student') {
            redirectPath = '/student-onboarding';
          }
          
          // Start countdown timer 
          const timer = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                // Redirect to onboarding
                navigate(redirectPath, { replace: true });
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          return;
        }

        // For users that are not in a signup flow (coming from somewhere else)
        // Always prioritize sending them to onboarding if it's incomplete
        if (role === 'tutor') {
          // Check if tutor has completed onboarding
          const { data: tutorProfile, error: tutorError } = await supabase
            .from('tutor_profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .maybeSingle();
          
          if (tutorError) {
            console.error('Error fetching tutor profile:', tutorError);
            setError('Unable to verify your tutor profile status.');
            return;
          }
          
          // If profile doesn't exist or onboarding not completed, send to onboarding
          if (!tutorProfile || tutorProfile.onboarding_completed === false) {
            console.log("Tutor needs to complete onboarding");
            navigate('/tutor-onboarding', { replace: true });
          } else {
            // Otherwise go to dashboard
            console.log("Tutor onboarding already completed, going to dashboard");
            navigate('/tutor-dashboard', { replace: true });
          }
        } else if (role === 'student') {
          // Check if student has completed onboarding
          const { data: studentProfile, error: studentError } = await supabase
            .from('student_profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .maybeSingle();
          
          if (studentError) {
            console.error('Error fetching student profile:', studentError);
            setError('Unable to verify your student profile status.');
            return;
          }
          
          // If profile doesn't exist or onboarding not completed, send to onboarding
          if (!studentProfile || studentProfile.onboarding_completed === false) {
            console.log("Student needs to complete onboarding");
            navigate('/student-onboarding', { replace: true });
          } else {
            // Otherwise go to dashboard
            console.log("Student onboarding already completed, going to dashboard");
            navigate('/student-dashboard', { replace: true });
          }
        } else {
          // If no role is set yet, navigate to role selection
          console.log("No role found, redirecting to role selection");
          navigate('/role-select', { replace: true });
        }
      } catch (err) {
        console.error("Error checking user status:", err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setCheckingStatus(false);
      }
    };

    if (!isLoading) {
      if (user) {
        checkUserStatus();
      } else {
        // If not logged in, redirect to login
        navigate('/login', { replace: true });
      }
    }
  }, [user, role, isLoading, navigate]);

  // Handle email verification flow
  const handleResendVerification = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`
        }
      });
      
      if (error) {
        setError(`Failed to resend verification email: ${error.message}`);
        return;
      }
      
      setError(null);
      // Show success message
      setEmailVerified(false);
    } catch (err) {
      console.error("Error resending verification:", err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  // If email verification was just completed successfully
  if (justVerified && emailVerified === true) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f0f4ff] via-[#e6f3ff] to-[#f8faff]">
        <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="h-8 w-8 text-green-600" />
          </motion.div>
          
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-2xl font-bold text-gray-800 mb-4"
          >
            Email Verified Successfully!
          </motion.h2>
          
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-600 mb-2"
          >
            Thank you for verifying your email address. You can now continue your profile setup here.
          </motion.p>
          
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="font-semibold text-amber-700">Important:</span>
            </div>
            <p className="text-sm text-amber-700">
              ✓ Please <span className="font-bold">close the original registration tab</span>
              <br />
              ✓ Continue your profile setup in <span className="font-bold">this tab</span>
            </p>
          </motion.div>

          {redirecting && (
            <div className="mb-6">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: countdown }}
                  className="h-full bg-green-500"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                You'll be redirected in {countdown} seconds automatically
              </p>
            </div>
          )}
          
          <motion.div
            animate={{ 
              boxShadow: ["0px 0px 0px rgba(62, 100, 255, 0)", "0px 0px 15px rgba(62, 100, 255, 0.5)", "0px 0px 0px rgba(62, 100, 255, 0)"]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
            }}
            className="rounded-md overflow-hidden"
          >
            <Button 
              onClick={() => {
                let redirectPath = '/role-select';
                if (role === 'tutor') {
                  redirectPath = '/tutor-onboarding';
                } else if (role === 'student') {
                  redirectPath = '/student-onboarding';
                }
                navigate(redirectPath, { replace: true });
              }}
              className="w-full py-5 bg-[#3E64FF] hover:bg-[#2D4FD6] text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="font-bold">Continue to Profile Setup</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // If email is not verified, show verification required message
  if (emailVerified === false && user) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f0f4ff] via-[#e6f3ff] to-[#f8faff]">
        <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center"
          >
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </motion.div>
          
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-2xl font-bold text-gray-800 mb-4"
          >
            Email Verification Required
          </motion.h2>
          
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-600 mb-4"
          >
            We've sent a verification link to <span className="font-medium">{user.email}</span>.
            Please check your inbox and click the link to verify your account.
          </motion.p>
          
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-600 mb-6"
          >
            After verification, you'll be directed to set up your profile.
          </motion.p>
          
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 mb-4 bg-red-100 text-red-800 rounded-md text-sm"
            >
              {error}
            </motion.div>
          )}
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handleResendVerification}
              className="w-full py-5 bg-[#3E64FF] hover:bg-[#2D4FD6] text-white transition-all duration-300"
            >
              Resend Verification Email
            </Button>
            
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full py-5 text-[#3E64FF] border-[#3E64FF] hover:bg-[#3E64FF]/10 transition-all duration-300"
            >
              I've Verified My Email
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f0f4ff] via-[#e6f3ff] to-[#f8faff]">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-red-500 mb-4 text-xl"
          >
            Error
          </motion.div>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-[#3E64FF] hover:bg-[#2D4FD6] text-white px-4 py-2 rounded"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f0f4ff] via-[#e6f3ff] to-[#f8faff]">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 rounded-full bg-[#3E64FF]/10 flex items-center justify-center mx-auto mb-6"
        >
          <div className="w-16 h-16 rounded-full border-4 border-t-[#3E64FF] border-r-[#3E64FF] border-b-transparent border-l-transparent animate-spin"></div>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          {isLoading ? "Verifying your account..." : "Setting up your experience..."}
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-600 mb-8"
        >
          {isLoading 
            ? "Please wait while we verify your account" 
            : user 
              ? "Preparing your dashboard"
              : "Redirecting you to login"
          }
        </motion.p>
      </div>
    </div>
  );
};

export default AuthCallback;
