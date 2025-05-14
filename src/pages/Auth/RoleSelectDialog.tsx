
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";

interface RoleSelectDialogProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
}

const RoleSelectDialog: React.FC<RoleSelectDialogProps> = ({ isOpen, userId, onClose }) => {
  const [selectedRole, setSelectedRole] = useState<'Student' | 'Tutor'>('Student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!userId) return;
    
    try {
      setIsSubmitting(true);
      
      // Update user profile with selected role
      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Role selected",
        description: `You've been registered as a ${selectedRole}`,
      });
      
      // Redirect based on role
      if (selectedRole === 'Tutor') {
        navigate('/tutor-dashboard');
      } else {
        navigate('/student-dashboard');
      }
      
    } catch (error) {
      console.error('Error setting user role:', error);
      toast({
        title: "Error setting role",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Your Role</DialogTitle>
          <DialogDescription>
            Please select whether you want to join as a student or a tutor.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-4 py-4">
          <Button
            variant={selectedRole === 'Student' ? 'default' : 'outline'}
            className={`flex-1 py-6 ${selectedRole === 'Student' ? 'bg-[#3E64FF]' : ''}`}
            onClick={() => setSelectedRole('Student')}
          >
            I'm a Student
          </Button>
          
          <Button
            variant={selectedRole === 'Tutor' ? 'default' : 'outline'}
            className={`flex-1 py-6 ${selectedRole === 'Tutor' ? 'bg-[#32D296]' : ''}`}
            onClick={() => setSelectedRole('Tutor')}
          >
            I'm a Tutor
          </Button>
        </div>
        
        <DialogFooter>
          <Button 
            type="submit" 
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
