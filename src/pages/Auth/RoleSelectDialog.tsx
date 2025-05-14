
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface RoleSelectDialogProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
}

const RoleSelectDialog: React.FC<RoleSelectDialogProps> = ({ isOpen, userId, onClose }) => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'tutor'>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!userId) return;
    
    try {
      setIsSubmitting(true);
      
      console.log(`Submitting role: ${selectedRole} for user: ${userId}`);
      
      // Update user profile with selected role
      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', userId);
        
      if (error) {
        console.error('Error setting role:', error);
        throw error;
      }
      
      console.log('Role updated successfully');
      
      toast({
        title: "Role selected",
        description: `You've been registered as a ${selectedRole}`,
      });
      
      // Call onClose first to update parent state
      onClose();
      
      // Then redirect based on role
      const redirectPath = selectedRole === 'tutor' ? '/tutor-dashboard' : '/student-dashboard';
      console.log(`Redirecting to ${redirectPath}`);
      navigate(redirectPath, { replace: true });
      
    } catch (error) {
      console.error('Error setting user role:', error);
      toast({
        title: "Error setting role",
        description: "Please try again",
        variant: "destructive",
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Your Role</DialogTitle>
          <DialogDescription>
            Please select whether you want to join as a student or a tutor.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-4 py-4">
          <Button
            type="button"
            variant={selectedRole === 'student' ? 'default' : 'outline'}
            className={`flex-1 py-6 ${selectedRole === 'student' ? 'bg-[#3E64FF]' : ''}`}
            onClick={() => setSelectedRole('student')}
          >
            I'm a Student
          </Button>
          
          <Button
            type="button"
            variant={selectedRole === 'tutor' ? 'default' : 'outline'}
            className={`flex-1 py-6 ${selectedRole === 'tutor' ? 'bg-[#32D296]' : ''}`}
            onClick={() => setSelectedRole('tutor')}
          >
            I'm a Tutor
          </Button>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelectDialog;
