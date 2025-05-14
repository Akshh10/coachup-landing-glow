
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import RoleSelectDialog from './RoleSelectDialog';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

const AuthCallback = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const location = useLocation();
  const { role } = useAuth();
  
  console.log('AuthCallback rendered, current role:', role);

  // Detect role from URL or user profile
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsLoading(true);
        
        console.log('Handling auth callback...');
        
        // Extract role from URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const roleParam = queryParams.get('role');
        console.log('Role from query params:', roleParam);
        
        // Get current user
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }
        
        if (!data.session?.user) {
          console.log('No user found in session');
          setShouldRedirect(true);
          setRedirectPath('/login');
          return;
        }
        
        const user = data.session.user;
        console.log('User found in session:', user.id);
        setUserId(user.id);
        
        // Check if user already has a role in profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        console.log('Profile data:', profile);
          
        if (profile?.role) {
          // User already has a role, redirect to appropriate dashboard
          const userRole = profile.role.toLowerCase();
          console.log('User has role:', userRole);
          
          setShouldRedirect(true);
          setRedirectPath(userRole === 'tutor' ? '/tutor-dashboard' : '/student-dashboard');
        } else if (roleParam) {
          // If role was passed in URL params, update profile
          console.log('Setting role from URL param:', roleParam);
          
          await supabase
            .from('profiles')
            .update({ role: roleParam })
            .eq('id', user.id);
          
          setShouldRedirect(true);
          setRedirectPath(roleParam.toLowerCase() === 'tutor' ? '/tutor-dashboard' : '/student-dashboard');
        } else {
          // No role found, show role selection dialog
          console.log('No role found, showing dialog');
          setIsRoleDialogOpen(true);
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        toast({
          title: "Authentication error",
          description: "There was a problem completing your signup",
          variant: "destructive",
        });
        setShouldRedirect(true);
        setRedirectPath('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    handleAuthCallback();
  }, [location.search]);
  
  // Handle dialog close
  const handleDialogClose = (selectedRole?: string) => {
    setIsRoleDialogOpen(false);
    
    if (selectedRole) {
      console.log('Role selected in dialog:', selectedRole);
      setShouldRedirect(true);
      setRedirectPath(selectedRole === 'tutor' ? '/tutor-dashboard' : '/student-dashboard');
    } else if (role) {
      // Check auth context for updated role
      console.log('Using role from auth context:', role);
      setShouldRedirect(true);
      setRedirectPath(role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard');
    }
  };
  
  // Perform redirect if needed
  if (shouldRedirect && redirectPath) {
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
          onClose={handleDialogClose}
        />
      )}
      
      {/* Show loading content while processing */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            {isLoading ? "Completing your registration..." : "Almost there!"}
          </h2>
          {isLoading ? (
            <div className="mt-4 animate-pulse flex justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mx-1"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full mx-1 animate-pulse delay-100"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full mx-1 animate-pulse delay-200"></div>
            </div>
          ) : (
            <p className="text-gray-500">Please select your role to continue.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthCallback;
