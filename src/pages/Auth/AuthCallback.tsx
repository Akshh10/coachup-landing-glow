
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import RoleSelectDialog from './RoleSelectDialog';
import { toast } from '@/components/ui/use-toast';

const AuthCallback = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsLoading(true);
        
        // Extract role from URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const roleParam = queryParams.get('role');
        
        // Process the session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!data.session?.user) {
          // No user in the session, redirect to login
          setRedirectPath('/login');
          return;
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
          // User already has a role, set it and prepare to redirect
          const userRole = profile.role.toLowerCase();
          setRole(userRole);
          const path = userRole === 'tutor' ? '/tutor-dashboard' : '/student-dashboard';
          setRedirectPath(path);
          
          // Log for debugging
          console.log(`User has role ${userRole}, redirecting to ${path}`);
        } else if (roleParam) {
          // If role was passed in URL params, update profile
          const userRole = roleParam.toLowerCase();
          
          await supabase
            .from('profiles')
            .update({ role: userRole })
            .eq('id', user.id);
          
          setRole(userRole);
          const path = userRole === 'tutor' ? '/tutor-dashboard' : '/student-dashboard';
          setRedirectPath(path);
          
          // Log for debugging
          console.log(`Set user role to ${userRole}, redirecting to ${path}`);
        } else {
          // No role found, show role selection dialog
          setIsRoleDialogOpen(true);
          console.log('No role found, showing dialog');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        toast({
          title: "Authentication error",
          description: "There was a problem completing your authentication",
          variant: "destructive",
        });
        
        // Redirect to login on error
        setRedirectPath('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    handleAuthCallback();
  }, [location.search, navigate]);
  
  // Handle role selection dialog closure
  const handleRoleDialogClose = () => {
    setIsRoleDialogOpen(false);
    
    // After role selection, we should have a role set
    if (role) {
      const path = role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard';
      setRedirectPath(path);
    }
  };
  
  // If we have a redirect path, navigate there
  if (redirectPath) {
    console.log(`Redirecting to ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }
  
  // Show role select dialog if needed
  return (
    <>
      {userId && (
        <RoleSelectDialog
          isOpen={isRoleDialogOpen}
          userId={userId}
          onClose={handleRoleDialogClose}
        />
      )}
      
      {/* Fallback content while loading or dialog is showing */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            {isLoading ? "Completing your authentication..." : "Almost there!"}
          </h2>
          {isLoading ? (
            <div className="mt-4 animate-pulse flex justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mx-1"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full mx-1 animate-pulse delay-100"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full mx-1 animate-pulse delay-200"></div>
            </div>
          ) : (
            !redirectPath && (
              <p className="text-gray-500">Please select your role to continue.</p>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default AuthCallback;
