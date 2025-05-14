
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Navbar from '@/components/Navbar';

const Insights = () => {
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

  // Sample blog/insights data
  const insights = [
    {
      id: 1,
      title: 'Top 10 In-Demand Skills for 2025',
      excerpt: 'Discover which skills will be most valuable in the coming years and how you can prepare for the future job market.',
      category: 'Career Development',
      readTime: '8 min read',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000',
      author: 'Sarah Johnson',
      date: 'June 15, 2023',
      featured: true
    },
    {
      id: 2,
      title: 'How to Master a New Language in 6 Months',
      excerpt: 'Effective strategies and science-backed techniques to help you learn a new language faster than you thought possible.',
      category: 'Language Learning',
      readTime: '12 min read',
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000',
      author: 'Mark Chen',
      date: 'May 28, 2023',
      featured: false
    },
    {
      id: 3,
      title: 'The Future of Learning: AI-Enhanced Education',
      excerpt: 'How artificial intelligence is transforming the educational landscape and what it means for students and educators.',
      category: 'EdTech Trends',
      readTime: '10 min read',
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000',
      author: 'Dr. Amelia Patel',
      date: 'July 3, 2023',
      featured: true
    },
    {
      id: 4,
      title: 'Why Coding is the New Literacy',
      excerpt: 'Programming skills are becoming essential across industries. Learn why coding literacy matters regardless of your career path.',
      category: 'Technology',
      readTime: '7 min read',
      thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000',
      author: 'James Wilson',
      date: 'June 22, 2023',
      featured: false
    },
    {
      id: 5,
      title: 'The Science of Effective Learning',
      excerpt: 'Research-backed strategies to improve retention, focus, and understanding when learning new skills or concepts.',
      category: 'Learning Methods',
      readTime: '15 min read',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000',
      author: 'Dr. Robert Lee',
      date: 'July 10, 2023',
      featured: false
    },
    {
      id: 6,
      title: 'From Student to Professional: Bridging the Skills Gap',
      excerpt: 'How to supplement your formal education with practical skills that employers are actually looking for.',
      category: 'Career Development',
      readTime: '9 min read',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000',
      author: 'Jessica Martinez',
      date: 'June 5, 2023',
      featured: false
    }
  ];

  const featuredInsights = insights.filter(insight => insight.featured);
  const regularInsights = insights.filter(insight => !insight.featured);

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
                Learning Insights & Resources
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-gray-600"
              >
                Expert advice, industry trends, and educational resources to help you learn effectively and stay ahead.
              </motion.p>
            </div>
            
            {/* Featured Articles */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Featured Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredInsights.map(insight => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col">
                      <div className="relative">
                        <AspectRatio ratio={16/9}>
                          <img
                            src={insight.thumbnail}
                            alt={insight.title}
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                        <div className="absolute top-4 left-4 bg-[#3E64FF] text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {insight.category}
                        </div>
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{insight.title}</h3>
                          <p className="text-gray-600 mb-4">{insight.excerpt}</p>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                          <span>{insight.author}</span>
                          <span>{insight.readTime}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Regular Articles */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {regularInsights.map(insight => (
                <motion.div key={insight.id} variants={itemVariants}>
                  <Card className="overflow-hidden h-full flex flex-col">
                    <AspectRatio ratio={16/9}>
                      <img
                        src={insight.thumbnail}
                        alt={insight.title}
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="mb-4">
                        <span className="text-xs font-semibold text-[#3E64FF]">{insight.category}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">{insight.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{insight.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
                        <span>{insight.author}</span>
                        <span>{insight.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Newsletter Section */}
            <div className="mt-20">
              <Card className="bg-gradient-to-r from-[#3E64FF]/10 to-[#5A78FF]/10 border-none overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="md:w-2/3">
                      <h3 className="text-2xl md:text-3xl font-bold mb-3">Subscribe to our newsletter</h3>
                      <p className="text-gray-600 mb-0 md:mb-4">Get the latest insights, learning tips, and industry trends delivered to your inbox monthly.</p>
                    </div>
                    <div className="w-full md:w-1/3">
                      <form className="flex flex-col sm:flex-row gap-3">
                        <input 
                          type="email" 
                          placeholder="Your email address" 
                          className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          required
                        />
                        <button 
                          type="submit"
                          className="bg-[#3E64FF] text-white h-10 px-4 py-2 rounded-md text-sm hover:bg-[#2D4FD6]"
                        >
                          Subscribe
                        </button>
                      </form>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Insights;
