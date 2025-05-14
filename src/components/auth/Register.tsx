
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'Student' | 'Tutor'>('Student');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

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
          }
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

      toast({
        title: "Registration successful",
        description: `Welcome to UpSkill, ${values.fullName}!`,
      });

      // Redirect based on role
      if (role === 'Tutor') {
        navigate('/tutor-dashboard');
      } else {
        navigate('/student-dashboard');
      }
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

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            role: role // Pass the selected role as a query parameter
          }
        }
      });
      
      if (error) {
        toast({
          title: "Google signup failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during Google signup:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

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
              onClick={() => setRole("Student")}
              type="button"
              className={`flex-1 py-3 text-center rounded-lg transition-all duration-300 ${
                role === "Student" 
                  ? "bg-white text-[#3E64FF] shadow-md" 
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              I'm a Student
            </button>
            <button
              onClick={() => setRole("Tutor")}
              type="button"
              className={`flex-1 py-3 text-center rounded-lg transition-all duration-300 ${
                role === "Tutor" 
                  ? "bg-white text-[#32D296] shadow-md" 
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              I'm a Tutor
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {role === "Student" 
                ? "Create your Student Account" 
                : "Create your Tutor Profile"}
            </h2>
            <p className="text-gray-600">
              {role === "Student"
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
                          {...field} 
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
                className={`w-full py-6 ${role === "Student" ? "bg-[#3E64FF] hover:bg-[#2D4FD6]" : "bg-[#32D296] hover:bg-[#28B580]"} text-white transition-all duration-300 hover:shadow-[0_0_12px_rgba(62,100,255,0.6)] group mt-4`}
                disabled={isRegistering}
              >
                <span>{isRegistering ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-6 py-5 border-gray-300 text-gray-700 flex items-center justify-center gap-3"
            onClick={handleGoogleSignUp}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
          
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
