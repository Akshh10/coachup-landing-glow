
import { useState, useEffect, useCallback } from "react";
import { supabase } from '@/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import { toast } from "@/components/ui/use-toast";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user role from profiles table
  const fetchUserRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }
      
      setRole(data?.role?.toLowerCase() ?? null);
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
    }
  }, []);

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Use setTimeout to prevent deadlocks
          setTimeout(() => {
            fetchUserRole(currentSession.user.id);
          }, 0);
        } else {
          setRole(null);
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
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserRole(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserRole]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setRole(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return { user, session, role, isLoading, signOut };
};
