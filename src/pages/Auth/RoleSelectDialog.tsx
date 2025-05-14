
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const RoleSelectDialog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'student' | 'tutor' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) return;
    
    setIsSubmitting(true);
    
    try {
      // Update user metadata with selected role
      const { error: updateError } = await supabase.auth.updateUser({
        data: { role: selectedRole }
      });
      
      if (updateError) throw updateError;
      
      // Create corresponding profile entry
      if (selectedRole === 'tutor') {
        const { error: profileError } = await supabase
          .from('tutor_profiles')
          .upsert({ id: user.id });
          
        if (profileError) throw profileError;
        
        navigate('/tutor-onboarding');
      } else {
        const { error: profileError } = await supabase
          .from('student_profiles')
          .upsert({ id: user.id });
          
        if (profileError) throw profileError;
        
        navigate('/student-onboarding');
      }
      
      toast({
        title: "Role selected successfully",
        description: `You've chosen to join as a ${selectedRole}`,
      });
    } catch (error) {
      console.error("Error setting user role:", error);
      toast({
        title: "Error setting role",
        description: "There was a problem setting your role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f0f4ff] via-[#e6f3ff] to-[#f8faff] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Choose Your Role</h1>
        <p className="text-gray-600 mt-2">How do you want to use UpSkill?</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-xl"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <Card 
            className={`flex-1 cursor-pointer transition-all ${
              selectedRole === 'student' 
                ? 'border-[#3E64FF] border-2 shadow-lg shadow-blue-200' 
                : 'border hover:shadow-md'
            }`}
            onClick={() => setSelectedRole('student')}
          >
            <CardContent className="p-6 text-center">
              <div 
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
                  selectedRole === 'student' ? 'bg-[#3E64FF]' : 'bg-gray-100'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={selectedRole === 'student' ? 'white' : '#3E64FF'} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-8 h-8"
                >
                  <path d="M7 6h10m-5 0v12m-7-6h14" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">I'm a Student</h3>
              <p className="text-gray-600">I want to learn new skills and connect with tutors</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`flex-1 cursor-pointer transition-all ${
              selectedRole === 'tutor' 
                ? 'border-[#32D296] border-2 shadow-lg shadow-green-200' 
                : 'border hover:shadow-md'
            }`}
            onClick={() => setSelectedRole('tutor')}
          >
            <CardContent className="p-6 text-center">
              <div 
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
                  selectedRole === 'tutor' ? 'bg-[#32D296]' : 'bg-gray-100'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={selectedRole === 'tutor' ? 'white' : '#32D296'} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-8 h-8"
                >
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">I'm a Tutor</h3>
              <p className="text-gray-600">I want to share my knowledge and coach students</p>
            </CardContent>
          </Card>
        </div>
        
        <Button 
          className={`w-full mt-8 py-6 ${
            selectedRole === 'tutor' ? 'bg-[#32D296] hover:bg-[#28B580]' : 'bg-[#3E64FF] hover:bg-[#2D4FD6]'
          } text-white transition-all duration-300 hover:shadow-lg`}
          disabled={!selectedRole || isSubmitting}
          onClick={handleRoleSelection}
        >
          {isSubmitting ? 'Setting up your account...' : 'Continue'}
        </Button>
      </motion.div>
    </div>
  );
};

export default RoleSelectDialog;
