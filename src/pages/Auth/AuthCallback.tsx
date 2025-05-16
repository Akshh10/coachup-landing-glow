import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';

const AuthCallback = () => {
  const { user, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user || isLoading) return;

      try {
        console.log("Checking user status for role:", role);
        
        // Get the user auth metadata to check if this is a brand new sign-up
        const { data: userData } = await supabase.auth.getUser();
        const isNewUser = userData?.user?.app_metadata?.is_new_user || false;
        
        console.log("Is new user:", isNewUser);
        
        if (role === 'tutor') {
          if (isNewUser) {
            // New user registration - check if they need onboarding
            const { data, error } = await supabase
              .from('tutor_profiles')
              .select('id')
              .eq('id', user.id)
              .maybeSingle();
              
            if (error) {
              console.error('Error fetching tutor profile:', error);
              setError('Unable to verify your tutor profile. Please try again.');
              return;
            }
            
            // If no profile exists, send to onboarding
            if (!data) {
              navigate('/tutor-onboarding', { replace: true });
            } else {
              navigate('/tutor-dashboard', { replace: true });
            }
          } else {
            // Existing user login - always go to dashboard
            navigate('/tutor-dashboard', { replace: true });
          }
        } else if (role === 'student') {
          if (isNewUser) {
            // New user registration - check if they need onboarding
            const { data, error } = await supabase
              .from('student_profiles')
              .select('id')
              .eq('id', user.id)
              .maybeSingle();
              
            if (error) {
              console.error('Error fetching student profile:', error);
              setError('Unable to verify your student profile. Please try again.');
              return;
            }
            
            // If no profile exists, send to onboarding
            if (!data) {
              navigate('/student-onboarding', { replace: true });
            } else {
              navigate('/student-dashboard', { replace: true });
            }
          } else {
            // Existing user login - always go to dashboard
            navigate('/student-dashboard', { replace: true });
          }
        } else {
          // If no role is set yet, navigate to role selection (only for new users)
          if (isNewUser) {
            console.log("New user with no role, redirecting to role selection");
            navigate('/role-select', { replace: true });
          } else {
            // If existing user has no role (shouldn't happen normally), send to homepage
            navigate('/', { replace: true });
          }
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
