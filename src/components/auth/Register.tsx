import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, RefreshCw, CheckCheck } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Keys for localStorage
const REGISTRATION_STORAGE_KEY = 'upskill_registration_data';
const VERIFICATION_STORAGE_KEY = 'upskill_email_verified';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'tutor'>('student');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registeredPassword, setRegisteredPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/auth/callback');
    }
  }, [user, navigate]);

  // Check if there's an existing registration in localStorage
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(REGISTRATION_STORAGE_KEY);
      if (storedData) {
        const { email, role: storedRole } = JSON.parse(storedData);
        setRegisteredEmail(email);
        setRole(storedRole);
        setRegistrationSuccess(true);
        console.log('Restored registration data from localStorage:', email, storedRole);
      }
    } catch (err) {
      console.error('Error reading registration data from localStorage:', err);
    }
  }, []);

  // Listen for changes to verification status in localStorage (from the verification tab)
  useEffect(() => {
    if (registrationSuccess && registeredEmail) {
      // Check if verification already happened
      try {
        const verificationData = localStorage.getItem(VERIFICATION_STORAGE_KEY);
        if (verificationData) {
          const { email, verified } = JSON.parse(verificationData);
          if (email === registeredEmail && verified) {
            console.log('Found existing verification in localStorage');
            checkVerificationStatus();
          }
        }
      } catch (err) {
        console.error('Error checking verification status in localStorage:', err);
      }

      // Listen for storage events (from the verification tab)
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === VERIFICATION_STORAGE_KEY && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            if (data.email === registeredEmail && data.verified) {
              console.log('Detected verification from another tab');
              checkVerificationStatus();
            }
          } catch (err) {
            console.error('Error handling storage event:', err);
          }
        }
      };

      // Add the event listener
      window.addEventListener('storage', handleStorageChange);

      // Cleanup
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [registrationSuccess, registeredEmail]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Check verification status directly
  const checkVerificationStatus = async () => {
    try {
      setIsCheckingVerification(true);
      
      // Get the stored registration data
      const storedData = localStorage.getItem(REGISTRATION_STORAGE_KEY);
      if (!storedData) {
        toast({
          title: "Registration data not found",
          description: "Please register again",
          variant: "destructive",
        });
        setRegistrationSuccess(false);
        return;
      }
      
      const { email, password } = JSON.parse(storedData);
      
      // Sign in with the stored credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Error signing in:', error);
        
        // If it's an "Email not confirmed" error, it's still not verified
        if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email not yet verified",
            description: "Please check your email and click the verification link",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Verification check failed",
            description: error.message,
            variant: "destructive",
          });
        }
        setIsCheckingVerification(false);
        return;
      }
      
      // Check if email is verified
      if (data?.user?.email_confirmed_at) {
        setIsVerified(true);
        
        toast({
          title: "Email verified!",
          description: "Setting up your profile...",
        });
        
        // Get the stored role
        const { role: storedRole } = JSON.parse(storedData);
        
        // Clear the stored registration data
        localStorage.removeItem(REGISTRATION_STORAGE_KEY);
        
        // Redirect to onboarding based on role
        setTimeout(() => {
          navigate(`/${storedRole === 'tutor' ? 'tutor' : 'student'}-onboarding`, { replace: true });
        }, 1500);
      } else {
        toast({
          title: "Email not yet verified",
          description: "Please check your email and click the verification link",
          variant: "destructive",
        });
        setIsCheckingVerification(false);
      }
    } catch (err) {
      console.error('Error checking verification status:', err);
      toast({
        title: "Verification check failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsCheckingVerification(false);
    }
  };

  const handleSignUp = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsRegistering(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            role: role
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`
        }
      });

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Store registration data in localStorage
      try {
        localStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify({
          email: values.email,
          password: values.password,
          role: role,
          fullName: values.fullName,
          timestamp: new Date().toISOString()
        }));
      } catch (e) {
        console.error('Error saving registration data to localStorage:', e);
      }

      setRegisteredEmail(values.email);
      setRegisteredPassword(values.password);
      setRegistrationSuccess(true);
      
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account",
      });
      
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  // If registration is successful, show verification message
  if (registrationSuccess) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#f0f4ff] via-[#e6f3ff] to-[#f8faff] flex flex-col">
        <header className="w-full py-6 px-6 md:px-10">
          <Link to="/" className="text-2xl font-bold text-[#3E64FF]">UpSkill</Link>
        </header>
        
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-8 text-center"
          >
            {isVerified ? (
              <>
                <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold mb-4">Email Verified!</h2>
                
                <p className="text-gray-600 mb-6">
                  Your email has been verified successfully. You're being redirected to complete your profile setup.
                </p>
                
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-6">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-green-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
                
                <p className="text-gray-600 mb-6">
                  We've sent a verification link to <span className="font-medium">{registeredEmail}</span>. 
                  Please check your inbox and click the link to verify your account.
                </p>
                
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-amber-800 mb-6">
                  <div className="flex items-start">
                    <RefreshCw className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-left">
                      <span className="font-medium">After verifying your email:</span> Come back to this page and click the "I've Verified My Email" button below.
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={checkVerificationStatus}
                  disabled={isCheckingVerification}
                  className="w-full py-6 bg-[#3E64FF] hover:bg-[#2D4FD6] text-white transition-all duration-300 flex items-center justify-center gap-2 mb-6"
                >
                  {isCheckingVerification ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Checking Verification Status...
                    </>
                  ) : (
                    <>
                      <CheckCheck className="h-5 w-5" />
                      I've Verified My Email
                    </>
                  )}
                </Button>
                
                <p className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or 
                  <button 
                    onClick={() => {
                      form.reset();
                      localStorage.removeItem(REGISTRATION_STORAGE_KEY);
                      setRegistrationSuccess(false);
                    }}
                    className="text-[#3E64FF] hover:underline ml-1"
                  >
                    try again
                  </button>
                </p>
              </>
            )}
          </motion.div>
        </div>
        
        <footer className="py-6 text-center text-gray-500">
          <p>© {new Date().getFullYear()} UpSkill. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f0f4ff] via-[#e6f3ff] to-[#f8faff] flex flex-col">
      <header className="w-full py-6 px-6 md:px-10">
        <Link to="/" className="text-2xl font-bold text-[#3E64FF]">UpSkill</Link>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#2E2E2E] mb-8"
        >
          Join UpSkill — Start Learning or Teaching Today
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-8"
        >
          <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setRole("student")}
              type="button"
              className={`flex-1 py-3 text-center rounded-lg transition-all duration-300 ${
                role === "student" 
                  ? "bg-white text-[#3E64FF] shadow-md" 
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              I'm a Student
            </button>
            <button
              onClick={() => setRole("tutor")}
              type="button"
              className={`flex-1 py-3 text-center rounded-lg transition-all duration-300 ${
                role === "tutor" 
                  ? "bg-white text-[#32D296] shadow-md" 
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              I'm a Tutor
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {role === "student" 
                ? "Create your Student Account" 
                : "Create your Tutor Profile"}
            </h2>
            <p className="text-gray-600">
              {role === "student"
                ? "Get connected with expert tutors to help you achieve your learning goals."
                : "Share your expertise and help students grow with personalized tutoring sessions."}
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          className="pl-10" 
                          disabled={isRegistering}
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter your email" 
                          className="pl-10" 
                          disabled={isRegistering}
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <FormControl>
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Create a password" 
                          className="pl-10" 
                          disabled={isRegistering}
                          {...field} 
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className={`w-full py-6 ${role === "student" ? "bg-[#3E64FF] hover:bg-[#2D4FD6]" : "bg-[#32D296] hover:bg-[#28B580]"} text-white transition-all duration-300 hover:shadow-[0_0_12px_rgba(62,100,255,0.6)] group mt-4`}
                disabled={isRegistering}
              >
                <span>{isRegistering ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-gray-600">
            Already have an account? <Link to="/login" className="text-[#3E64FF] hover:underline">Log in</Link>
          </div>
        </motion.div>
      </div>
      
      <footer className="py-6 text-center text-gray-500">
        <p>© {new Date().getFullYear()} UpSkill. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Register;
