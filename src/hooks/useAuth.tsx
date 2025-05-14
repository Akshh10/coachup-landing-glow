
import { useState, useEffect, useCallback } from "react";
import { supabase } from '@/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import { toast } from "@/components/ui/use-toast";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // Fetch user role and profile from profiles table
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
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
      
      console.log('Profile data received:', data);
      
      setProfile(data);
      if (data?.role) {
        const userRole = data.role.toLowerCase();
        console.log(`Setting user role to ${userRole}`);
        setRole(userRole);
      } else {
        console.log('No role found in profile data');
        setRole(null);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  }, []);

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log(`Auth state change event: ${event}`);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log('User is authenticated, user ID:', currentSession.user.id);
          // Use setTimeout to prevent deadlocks
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          console.log('No user in session');
          setRole(null);
          setProfile(null);
        }

        if (event === 'SIGNED_IN') {
          toast({
            title: "Signed in successfully",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out successfully",
          });
        }
        
        setIsLoading(false);
      }
    );

    // Then check for existing session
    console.log('Checking for existing session');
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log('Found existing session with user ID:', currentSession.user.id);
        fetchUserProfile(currentSession.user.id);
      } else {
        console.log('No existing session found');
      }
      
      setIsLoading(false);
    });

    return () => {
      console.log('Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const signOut = async () => {
    try {
      console.log('Signing out user');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setRole(null);
      setProfile(null);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return { user, session, role, profile, isLoading, signOut };
};
