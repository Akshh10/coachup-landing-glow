
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useScrollAnimation } from "@/utils/animations";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Skills from "@/components/Skills";
import WhyChooseUs from "@/components/WhyChooseUs";
import Blogs from "@/components/Blogs";
import BecomeCoach from "@/components/BecomeCoach";
import Footer from "@/components/Footer";

const Index = () => {
  const { user, role } = useAuth();
  const scrollAnimation = useScrollAnimation();
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with animation */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4ff] via-[#e6f3ff] to-[#f8faff] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 lg:w-96 lg:h-96 bg-[#3E64FF]/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-1/3 right-1/4 w-32 h-32 lg:w-64 lg:h-64 bg-[#32D296]/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-1/4 right-1/3 w-48 h-48 lg:w-80 lg:h-80 bg-[#F0B103]/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        </div>
        
        <div className="container mx-auto px-4 pt-24 z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-[#2E2E2E] mb-6 leading-tight">
                Learn Skills from Expert Tutors
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Connect with skilled tutors to help you master new skills and achieve your goals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
                <Button 
                  className="bg-[#3E64FF] hover:bg-[#2D4FD6] text-white px-6 py-6 text-lg"
                  asChild
                >
                  <Link to="/register">Join UpSkill</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-[#3E64FF] text-[#3E64FF] hover:bg-[#3E64FF]/10 px-6 py-6 text-lg"
                  onClick={scrollToHowItWorks}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" 
                  alt="Students learning" 
                  className="rounded-xl shadow-2xl mx-auto"
                />
                
                {/* Floating elements */}
                <motion.div 
                  className="absolute -top-8 -left-8 bg-white rounded-lg shadow-lg p-3 flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <span className="text-[#3E64FF] text-xl font-bold mr-2">1000+</span>
                  <span className="text-sm">Expert Tutors</span>
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-8 -right-8 bg-white rounded-lg shadow-lg p-3"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  <div className="flex items-center mb-1">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <span className="text-sm">4.9 Average Rating</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <div ref={howItWorksRef}>
        <HowItWorks />
      </div>
      
      {/* Featured Skills Section */}
      <section ref={scrollAnimation} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Skills to Learn</h2>
            <p className="text-xl text-gray-600">Explore the most in-demand skills taught by our expert tutors</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Skill Cards */}
            {[
              { 
                title: "Programming & Development", 
                icon: "💻", 
                students: "10,523",
                tutors: "372",
                color: "bg-gradient-to-r from-blue-500 to-indigo-500"
              },
              { 
                title: "Business & Marketing", 
                icon: "📊", 
                students: "8,291",
                tutors: "245",
                color: "bg-gradient-to-r from-green-500 to-teal-500"
              },
              { 
                title: "Design & Creativity", 
                icon: "🎨", 
                students: "7,845",
                tutors: "213",
                color: "bg-gradient-to-r from-pink-500 to-rose-500"
              },
              { 
                title: "Languages", 
                icon: "🗣️", 
                students: "15,120",
                tutors: "485",
                color: "bg-gradient-to-r from-amber-500 to-orange-500"
              },
              { 
                title: "Personal Development", 
                icon: "🧠", 
                students: "6,734",
                tutors: "189",
                color: "bg-gradient-to-r from-cyan-500 to-sky-500"
              },
              { 
                title: "Academic Subjects", 
                icon: "📚", 
                students: "12,476",
                tutors: "328",
                color: "bg-gradient-to-r from-violet-500 to-purple-500"
              }
            ].map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl">
                  <div className={`h-2 ${skill.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{skill.icon}</span>
                      <h3 className="text-xl font-bold">{skill.title}</h3>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <span>{skill.students} Students</span>
                      <span>{skill.tutors} Tutors</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-2 border-[#3E64FF] text-[#3E64FF] hover:bg-[#3E64FF] hover:text-white"
                      asChild
                    >
                      <Link to="/skills">Explore Skills</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              className="bg-[#3E64FF] hover:bg-[#2D4FD6] text-white"
              asChild
            >
              <Link to="/skills">View All Skills</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <WhyChooseUs />
      
      {/* Insights/Blog Section */}
      <section ref={scrollAnimation} className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Learning Insights</h2>
            <p className="text-xl text-gray-600">Latest tips, trends, and educational resources</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Top 10 In-Demand Skills for 2025",
                excerpt: "Discover which skills will be most valuable in the coming years and how you can prepare.",
                image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                tag: "Career Development",
                date: "June 15, 2023"
              },
              {
                title: "How to Master a New Skill Fast",
                excerpt: "Learn effective strategies to accelerate your learning process and retain knowledge better.",
                image: "https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                tag: "Learning Tips",
                date: "June 10, 2023"
              },
              {
                title: "The Future of Online Education",
                excerpt: "How technology is transforming the way we learn and what it means for students worldwide.",
                image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                tag: "EdTech Trends",
                date: "June 5, 2023"
              }
            ].map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-2">
                      <span className="inline-block bg-blue-100 text-[#3E64FF] text-xs font-semibold px-2.5 py-0.5 rounded">
                        {article.tag}
                      </span>
                      <span className="text-gray-500 text-xs ml-2">{article.date}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-1">{article.excerpt}</p>
                    <Button 
                      variant="ghost" 
                      className="text-[#3E64FF] hover:bg-[#3E64FF]/10 p-0 justify-start"
                      asChild
                    >
                      <Link to="/insights">Read More</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              className="bg-[#3E64FF] hover:bg-[#2D4FD6] text-white"
              asChild
            >
              <Link to="/insights">Read All Articles</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Become a Tutor CTA */}
      <section className="py-20 bg-gradient-to-r from-[#3E64FF] to-[#5A78FF] text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Share Your Knowledge</h2>
              <p className="text-xl opacity-90 mb-6">Join our platform as a tutor and help students achieve their goals while earning on your own schedule.</p>
              <Button 
                className="bg-white text-[#3E64FF] hover:bg-gray-100"
                size="lg"
                asChild
              >
                <Link to="/register">Become a Tutor</Link>
              </Button>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Flexible Schedule</h3>
                    <p className="text-sm opacity-80">Teach when it works for you</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Set Your Rates</h3>
                    <p className="text-sm opacity-80">You decide how much you charge</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Grow Your Business</h3>
                    <p className="text-sm opacity-80">Build your reputation and client base</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
