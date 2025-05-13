
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7 }
    }
  };

  // Animation for floating elements
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-navy-50 to-white overflow-hidden relative">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 right-20 w-32 h-32 bg-[#E6F3FF] rounded-full blur-3xl opacity-50"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.6, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute bottom-20 left-20 w-40 h-40 bg-[#F0F4FF] rounded-full blur-3xl opacity-40"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.5, 0.4],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="md:w-1/2 mb-10 md:mb-0"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-navy-900">
              Find the Perfect Tutor for Your Learning Journey
              <span className="text-teal-600 block mt-2">Live and Online</span>
            </h1>
            <p className="mt-6 text-lg text-navy-700 md:pr-16">
              Get personalized 1-on-1 or small-group tutoring from expert coaches. 
              Learn at your own pace, achieve your goals, and build confidence.
            </p>
            <div className="mt-10">
              <Link to="/signup">
                <Button 
                  className="text-white bg-navy-700 hover:bg-navy-800 font-medium px-6 py-6 text-base rounded-lg shadow-lg cta-button transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-200"
                >
                  Join UpSkill Today
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <div className="md:w-1/2 relative">
            <motion.div variants={itemVariants} className="relative z-10">
              <div className="bg-white rounded-2xl shadow-2xl p-3 md:ml-10 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
                  alt="Virtual learning session with student and tutor" 
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
            </motion.div>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-10 -left-10 bg-blue-50 p-3 rounded-lg shadow-lg"
              animate={floatingAnimation}
            >
              <motion.div 
                className="bg-white p-2 rounded-full"
                whileHover={{ scale: 1.1 }}
              >
                <img
                  src="https://i.pravatar.cc/150?u=tutor1"
                  alt="Tutor"
                  className="h-12 w-12 rounded-full object-cover"
                />
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-5 -right-5 bg-green-50 p-3 rounded-lg shadow-lg"
              animate={{
                ...floatingAnimation,
                transition: { ...floatingAnimation.transition, delay: 0.5 }
              }}
            >
              <motion.div 
                className="bg-white p-2 rounded-full"
                whileHover={{ scale: 1.1 }}
              >
                <img
                  src="https://i.pravatar.cc/150?u=tutor2"
                  alt="Tutor"
                  className="h-12 w-12 rounded-full object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
