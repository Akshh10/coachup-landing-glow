
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Book, Clock, Check, ArrowRight } from "lucide-react";

const SignUp: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f0f4ff] via-[#e6f3ff] to-[#f8faff] flex flex-col">
      <header className="w-full py-6 px-6 md:px-10">
        <Link to="/" className="text-2xl font-bold text-[#3E64FF]">CoachUp</Link>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#2E2E2E] mb-12"
        >
          Join CoachUp — Start Learning or Teaching Today
        </motion.h1>
        
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 px-4">
          {/* Student Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-xl p-8 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">I'm a Student</h2>
            <ul className="space-y-5 mb-10">
              <li className="flex items-start">
                <Book className="h-6 w-6 mr-4 text-[#3E64FF] flex-shrink-0" />
                <p className="text-[#2E2E2E]">Access top tutors in any subject to reach your academic goals</p>
              </li>
              <li className="flex items-start">
                <Clock className="h-6 w-6 mr-4 text-[#3E64FF] flex-shrink-0" />
                <p className="text-[#2E2E2E]">Flexible scheduling that fits around your timetable</p>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 mr-4 text-[#3E64FF] flex-shrink-0" />
                <p className="text-[#2E2E2E]">Personalized learning plans tailored to your specific needs</p>
              </li>
            </ul>
            <Link to="/student-dashboard">
              <Button className="w-full py-6 bg-[#3E64FF] hover:bg-[#2D4FD6] text-white transition-all duration-300 hover:shadow-[0_0_12px_#3E64FF] group">
                <span>Sign Up as a Student</span>
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="mt-6">
              <Button variant="outline" className="w-full py-5 border-gray-300 text-gray-700 flex items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
            </div>
          </motion.div>
          
          {/* Tutor Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1 bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-xl p-8 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl border-t-4 border-[#32D296]"
          >
            <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">I'm a Tutor</h2>
            <ul className="space-y-5 mb-10">
              <li className="flex items-start">
                <Book className="h-6 w-6 mr-4 text-[#32D296] flex-shrink-0" />
                <p className="text-[#2E2E2E]">Share your expertise and help students achieve academic success</p>
              </li>
              <li className="flex items-start">
                <Clock className="h-6 w-6 mr-4 text-[#32D296] flex-shrink-0" />
                <p className="text-[#2E2E2E]">Create your own schedule and earn competitive rates</p>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 mr-4 text-[#32D296] flex-shrink-0" />
                <p className="text-[#2E2E2E]">Access our platform tools to manage bookings and track progress</p>
              </li>
            </ul>
            <Link to="/tutor-dashboard">
              <Button className="w-full py-6 bg-[#32D296] hover:bg-[#28B580] text-white transition-all duration-300 hover:shadow-[0_0_12px_#32D296] group">
                <span>Sign Up as a Tutor</span>
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="mt-6">
              <Button variant="outline" className="w-full py-5 border-gray-300 text-gray-700 flex items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      <footer className="py-6 text-center text-gray-500">
        <p>© {new Date().getFullYear()} CoachUp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SignUp;
