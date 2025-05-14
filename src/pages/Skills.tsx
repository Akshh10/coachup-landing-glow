
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const Skills = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Sample skills data
  const skills = [
    {
      id: 1,
      title: 'Programming & Development',
      icon: '💻',
      description: 'Learn to code and build software, websites, or apps',
      subSkills: ['Python', 'JavaScript', 'Web Development', 'Mobile App Development', 'Data Science'],
      color: 'from-blue-500 to-violet-500'
    },
    {
      id: 2,
      title: 'Business & Marketing',
      icon: '📊',
      description: 'Master business strategy, marketing, and entrepreneurship',
      subSkills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Business Analysis', 'Project Management'],
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 3,
      title: 'Design & Creativity',
      icon: '🎨',
      description: 'Develop creative skills in design, art, and multimedia',
      subSkills: ['UI/UX Design', 'Graphic Design', 'Photography', 'Video Editing', 'Animation'],
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 4,
      title: 'Languages',
      icon: '🗣️',
      description: 'Learn new languages or improve your current language skills',
      subSkills: ['English', 'Spanish', 'Mandarin', 'French', 'Japanese', 'German'],
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 5,
      title: 'Personal Development',
      icon: '🧠',
      description: 'Improve yourself through soft skills and personal growth',
      subSkills: ['Public Speaking', 'Leadership', 'Time Management', 'Critical Thinking', 'Emotional Intelligence'],
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 6,
      title: 'Academic Subjects',
      icon: '📚',
      description: 'Get help with school subjects and standardized tests',
      subSkills: ['Mathematics', 'Science', 'History', 'Literature', 'Test Preparation'],
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gradient-to-br from-[#f0f4ff] via-[#e6f3ff] to-[#f8faff]">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              >
                Discover Skills to Master
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-gray-600"
              >
                Explore the range of skills you can learn on UpSkill with expert tutors dedicated to your growth.
              </motion.p>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {skills.map((skill) => (
                <motion.div key={skill.id} variants={itemVariants}>
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${skill.color}`}></div>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">{skill.icon}</span>
                        <h3 className="text-xl font-bold">{skill.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-4">{skill.description}</p>
                      <div className="mb-5">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Popular skills:</h4>
                        <div className="flex flex-wrap gap-2">
                          {skill.subSkills.slice(0, 3).map((subSkill, index) => (
                            <span 
                              key={index} 
                              className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700"
                            >
                              {subSkill}
                            </span>
                          ))}
                          {skill.subSkills.length > 3 && (
                            <span className="inline-block rounded-full px-3 py-1 text-sm text-[#3E64FF]">
                              +{skill.subSkills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <Button 
                        asChild 
                        variant="outline" 
                        className="w-full border-[#3E64FF] text-[#3E64FF] hover:bg-[#3E64FF] hover:text-white"
                      >
                        <Link to={`/skills/${skill.id}`}>
                          Explore {skill.title}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-[#3E64FF] to-[#5A78FF] text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start learning?</h2>
              <p className="text-xl mb-8 opacity-90">
                Connect with expert tutors and start your learning journey today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-[#3E64FF] hover:bg-gray-100"
                >
                  <Link to="/register">Find a Tutor</Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/20"
                >
                  <Link to="/register">Become a Tutor</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Skills;
