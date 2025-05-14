
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import RoleSelectDialog from './RoleSelectDialog';
import { toast } from '@/components/ui/use-toast';

const AuthCallback = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const location = useLocation();
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsLoading(true);
        
        // Extract role from URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const roleParam = queryParams.get('role');
        
        // Process the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!data.session?.user) {
          throw new Error('No user found in session');
        }
        
        const user = data.session.user;
        setUserId(user.id);
        
        // Check if user already has a role in profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (profile?.role) {
          // User already has a role
          setRole(profile.role.toLowerCase());
        } else if (roleParam) {
          // If role was passed in URL params, update profile
          await supabase
            .from('profiles')
            .update({ role: roleParam })
            .eq('id', user.id);
          
          setRole(roleParam.toLowerCase());
        } else {
          // No role found, show role selection dialog
          setIsRoleDialogOpen(true);
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        toast({
          title: "Authentication error",
          description: "There was a problem completing your signup",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    handleAuthCallback();
  }, [location.search]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Completing your registration...</h2>
          <div className="mt-4 animate-pulse flex justify-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-1"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-1 animate-pulse delay-100"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-1 animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // If we have a role, redirect accordingly
  if (role && !isRoleDialogOpen) {
    return <Navigate to={role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard'} replace />;
  }
  
  // Show role select dialog if needed
  return (
    <>
      {userId && (
        <RoleSelectDialog
          isOpen={isRoleDialogOpen}
          userId={userId}
          onClose={() => setIsRoleDialogOpen(false)}
        />
      )}
      
      {/* Fallback content while dialog is showing */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Almost there!</h2>
          <p className="text-gray-500">Please select your role to continue.</p>
        </div>
      </div>
    </>
  );
};

export default AuthCallback;
