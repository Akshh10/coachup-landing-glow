
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-navy-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2 mb-10 md:mb-0"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-navy-900">
              Find the Perfect Tutor for Coding, Math, or Science — 
              <span className="text-teal-600">Live and Online</span>
            </h1>
            <p className="mt-6 text-lg text-navy-700 md:pr-16">
              Get personalized 1-on-1 or small-group tutoring from expert coaches. 
              Learn at your own pace, achieve your academic goals, and build confidence.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-5">
              <Button 
                className="text-white bg-navy-700 hover:bg-navy-800 font-medium px-6 py-6 text-base rounded-lg shadow-md cta-button"
              >
                Find a Tutor
              </Button>
              <Button 
                variant="outline" 
                className="border-navy-600 text-navy-800 hover:bg-navy-50 font-medium px-6 py-6 text-base rounded-lg cta-button"
              >
                Apply as a Coach
              </Button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:w-1/2"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-3 md:ml-10 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
                alt="Students in virtual learning session" 
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
