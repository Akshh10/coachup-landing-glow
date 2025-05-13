
import { ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useScrollAnimation } from "@/utils/scrollAnimation";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Blogs = () => {
  const animationRef = useScrollAnimation();

  const blogs = [
    {
      id: "1",
      title: "Top 10 In-Demand Skills for 2025",
      excerpt: "Discover which skills will be most valuable in the near future and how you can prepare for tomorrow's job market.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      readTime: "6 min read",
      category: "Career Growth"
    },
    {
      id: "2",
      title: "How to Master a New Skill in Half the Time",
      excerpt: "Learn effective learning techniques used by top performers to accelerate your skill acquisition process.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      readTime: "8 min read",
      category: "Learning Tips"
    },
    {
      id: "3",
      title: "Why One-on-One Learning Beats Traditional Education",
      excerpt: "Explore how personalized learning approaches can lead to better outcomes compared to traditional classroom settings.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      readTime: "5 min read",
      category: "Education"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="blogs" className="py-20 md:py-28 bg-white section-container" ref={animationRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-4">Insights & Resources</h2>
          <div className="w-24 h-1 bg-[#3E64FF] mx-auto mb-6"></div>
          <p className="mt-4 text-lg text-[#2E2E2E] max-w-2xl mx-auto">
            Discover the latest trends, learning strategies, and expert advice to accelerate your growth.
          </p>
        </div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {blogs.map((blog, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="overflow-hidden rounded-2xl border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] h-full">
                <div>
                  <AspectRatio ratio={16/9} className="bg-muted">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      className="object-cover w-full h-full rounded-t-2xl" 
                    />
                  </AspectRatio>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-3 py-1 bg-[#F0F4FF] text-[#3E64FF] rounded-full text-xs font-medium">
                      {blog.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {blog.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">{blog.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{blog.excerpt}</p>
                </CardContent>
                <CardFooter className="pt-0 pb-6 px-6">
                  <Button variant="ghost" className="text-[#3E64FF] hover:text-[#2D4FD6] hover:bg-[#F0F4FF] p-0 group">
                    <span>Read More</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Blogs;
