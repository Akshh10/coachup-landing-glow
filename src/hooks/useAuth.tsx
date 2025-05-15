import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from '@/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  // Use refs to prevent duplicate operations
  const profileFetchedRef = useRef(false);
  const isMountedRef = useRef(true);
  const currentUserIdRef = useRef<string | null>(null);
  const initialLoadCompleteRef = useRef(false);
  const isSigningOutRef = useRef(false);
  const authListenerRef = useRef<{ subscription: { unsubscribe: () => void } } | null>(null);

  // Fetch user role from profiles table
  const fetchUserProfile = useCallback(async (userId: string) => {
    // Skip if already fetched for this user ID or component unmounted or signing out
    if ((profileFetchedRef.current && currentUserIdRef.current === userId) || 
        !isMountedRef.current || 
        isSigningOutRef.current) return;
    
    try {
      profileFetchedRef.current = true;
      currentUserIdRef.current = userId;
      console.log(`Fetching profile for user ${userId}`);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      if (!isMountedRef.current || isSigningOutRef.current) return;
      
      console.log('Profile data received:', data);
      
      // Only update state if there are actual changes
      if (JSON.stringify(profile) !== JSON.stringify(data)) {
        setProfile(data);
      
        if (data?.role) {
          const userRole = data.role.toLowerCase();
          console.log(`Setting user role to ${userRole}`);
          setRole(userRole);
        } else {
          console.log('No role found in profile data');
          setRole(null);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  }, [profile]);

  // Handle session changes, with equality check to prevent redundant updates
  const handleSessionChange = useCallback((currentSession: Session | null) => {
    if (!isMountedRef.current || isSigningOutRef.current) return;
    
    const currentUserId = currentSession?.user?.id || null;
    const existingUserId = session?.user?.id || null;
    
    // Only update if user ID has changed
    if (currentUserId !== existingUserId) {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentUserId) {
        console.log('User is authenticated, user ID:', currentUserId);
        fetchUserProfile(currentUserId);
      } else {
        console.log('No user in session');
        setRole(null);
        setProfile(null);
        profileFetchedRef.current = false;
        currentUserIdRef.current = null;
      }
    }
  }, [fetchUserProfile, session]);

  // Setup auth listener
  const setupAuthListener = useCallback(() => {
    if (authListenerRef.current) {
      console.log('Auth listener already exists, cleaning up before setting up a new one');
      authListenerRef.current.subscription.unsubscribe();
      authListenerRef.current = null;
    }

    console.log('Setting up auth state listener');
    const { data } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMountedRef.current || isSigningOutRef.current) {
          console.log('Ignoring auth event because component is unmounted or signing out');
          return;
        }
        
        // Avoid duplicate notifications during initialization
        if (!initialLoadCompleteRef.current && event === 'SIGNED_IN') {
          console.log('Ignoring initial SIGNED_IN event');
          return;
        }
        
        console.log(`Auth state change event: ${event}`);
        
        // Handle session change only if not signing out
        if (!isSigningOutRef.current) {
          handleSessionChange(currentSession);
        }

        // Show toasts only after initial load is complete
        if (initialLoadCompleteRef.current) {
          if (event === 'SIGNED_IN' && !isSigningOutRef.current) {
            toast({ title: "Signed in successfully" });
          } else if (event === 'SIGNED_OUT') {
            toast({ title: "Signed out successfully" });
            // Clear local storage on sign out to prevent automatic re-auth
            localStorage.removeItem('supabase.auth.token');
            localStorage.removeItem('sb-refresh-token');
            localStorage.removeItem('sb-access-token');
            localStorage.removeItem('supabase.auth.expires_at');
          }
        }
      }
    );
    
    authListenerRef.current = data;
    return data.subscription;
  }, [handleSessionChange]);

  useEffect(() => {
    isMountedRef.current = true;
    isSigningOutRef.current = false;
    initialLoadCompleteRef.current = false;
    
    // Set up auth state listener
    const subscription = setupAuthListener();

    // Check for existing session only once on mount
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!isMountedRef.current || isSigningOutRef.current) return;
      console.log('Checking for existing session');
      
      handleSessionChange(currentSession);
      
      setIsLoading(false);
      initialLoadCompleteRef.current = true;
    });

    // Clean up function
    return () => {
      console.log('Cleaning up auth listener');
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [handleSessionChange, setupAuthListener]);

  const signOut = async () => {
    try {
      console.log('Signing out user');
      isSigningOutRef.current = true;
      
      // Unsubscribe from auth listener to prevent re-authentication
      if (authListenerRef.current) {
        console.log('Unsubscribing from auth listener before sign out');
        authListenerRef.current.subscription.unsubscribe();
        authListenerRef.current = null;
      }
      
      // Clear all auth state first
      setUser(null);
      setSession(null);
      setRole(null);
      setProfile(null);
      profileFetchedRef.current = false;
      currentUserIdRef.current = null;
      
      // Clear localStorage items to prevent auto-login
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-refresh-token');
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('supabase.auth.expires_at');
      
      // Then sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      console.log('User signed out successfully, redirecting to home page');
      
      // Force page reload to clear any in-memory state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      isSigningOutRef.current = false;
      
      // Re-setup the auth listener if sign out failed
      setupAuthListener();
    }
  };

  return { user, session, role, profile, isLoading, signOut };
};

const AuthCallback = () => {
  const { user, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user || isLoading) return;

      try {
        console.log("Checking onboarding status for role:", role);
        
        // Get the user auth metadata to check if this is a brand new sign-up
        // This is a better way to determine if it's first-time login
        const { data: metadata } = await supabase.auth.getUser();
        const isNewUser = metadata?.user?.app_metadata?.is_new_user || false;
        
        if (role === 'tutor') {
          // For existing users (not brand new sign-ups), always go to dashboard
          if (!isNewUser) {
            console.log("Existing tutor user, redirecting to dashboard");
            navigate('/tutor-dashboard', { replace: true });
            return;
          }
          
          // Only for new users, check if they have completed profile setup
          const { data, error } = await supabase
            .from('tutor_profiles')
            .select('id') // Just check if the row exists, don't need all fields
            .eq('id', user.id)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching tutor profile:', error);
            setError('Unable to verify your tutor profile. Please try again.');
            return;
          }
          
          // New user with no profile - go to onboarding
          if (!data) {
            navigate('/tutor-onboarding', { replace: true });
          } else {
            // New user with some profile data - go to dashboard
            navigate('/tutor-dashboard', { replace: true });
          }
          
        } else if (role === 'student') {
          // For existing users (not brand new sign-ups), always go to dashboard
          if (!isNewUser) {
            console.log("Existing student user, redirecting to dashboard");
            navigate('/student-dashboard', { replace: true });
            return;
          }
          
          // Only for new users, check if they have a profile record
          const { data, error } = await supabase
            .from('student_profiles')
            .select('id') // Just check if the row exists, don't need all fields
            .eq('id', user.id)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching student profile:', error);
            setError('Unable to verify your student profile. Please try again.');
            return;
          }
          
          // New user with no profile - go to onboarding
          if (!data) {
            navigate('/student-onboarding', { replace: true });
          } else {
            // New user with some profile data - go to dashboard
            navigate('/student-dashboard', { replace: true });
          }
          
        } else {
          // If no role is set yet, navigate to role selection
          console.log("No role found, redirecting to role selection");
          navigate('/role-select', { replace: true });
        }
      } catch (err) {
        console.error("Error checking onboarding status:", err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setCheckingOnboarding(false);
      }
    };

    if (!isLoading) {
      if (user && role) {
        checkOnboardingStatus();
      } else if (!user) {
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
