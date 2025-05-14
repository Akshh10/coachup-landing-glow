
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';

const AuthCallback = () => {
  const { user, role, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user || isLoading) return;

      try {
        if (role === 'tutor') {
          const { data, error } = await supabase
            .from('tutor_profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          
          if (data?.onboarding_completed) {
            navigate('/tutor-dashboard');
          } else {
            navigate('/tutor-onboarding');
          }
        } else if (role === 'student') {
          const { data, error } = await supabase
            .from('student_profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          
          if (data?.onboarding_completed) {
            navigate('/student-dashboard');
          } else {
            navigate('/student-onboarding');
          }
        } else {
          // If no role is set yet, navigate to role selection
          navigate('/role-select');
        }
      } catch (err) {
        console.error("Error checking onboarding status:", err);
        // If there's an error, send to onboarding just to be safe
        if (role === 'tutor') {
          navigate('/tutor-onboarding');
        } else if (role === 'student') {
          navigate('/student-onboarding');
        } else {
          navigate('/role-select');
        }
      } finally {
        setCheckingOnboarding(false);
      }
    };

    if (user && role) {
      checkOnboardingStatus();
    } else if (!isLoading && !user) {
      // If not logged in, redirect to login
      navigate('/login');
    }
  }, [user, role, isLoading, navigate]);

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
          Setting up your experience...
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-600 mb-8"
        >
          {isLoading ? "Verifying your account" : "Preparing your dashboard"}
        </motion.p>
      </div>
    </div>
  );
};

export default AuthCallback;
