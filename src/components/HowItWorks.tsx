
import { ArrowRight, CheckCircle, Search, Calendar, Video } from "lucide-react";
import { useScrollAnimation } from "@/utils/scrollAnimation";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const animationRef = useScrollAnimation();

  const studentSteps = [
    {
      icon: <Search className="h-12 w-12 text-teal-600" />,
      title: "Find Your Perfect Coach",
      description: "Browse profiles of verified coaches, read reviews, and filter by subject, price, and availability."
    },
    {
      icon: <Calendar className="h-12 w-12 text-teal-600" />,
      title: "Book a Session",
      description: "Schedule a session at a time that works for you. Pay securely through our platform."
    },
    {
      icon: <Video className="h-12 w-12 text-teal-600" />,
      title: "Learn and Grow",
      description: "Connect via our integrated virtual classroom with video, chat, and collaborative tools."
    }
  ];

  const coachSteps = [
    {
      icon: <CheckCircle className="h-12 w-12 text-teal-600" />,
      title: "Create Your Profile",
      description: "Set up your profile with your expertise, teaching style, rates, and availability."
    },
    {
      icon: <Calendar className="h-12 w-12 text-teal-600" />,
      title: "Accept Bookings",
      description: "Receive booking requests from students. Accept or propose alternative times."
    },
    {
      icon: <Video className="h-12 w-12 text-teal-600" />,
      title: "Teach and Earn",
      description: "Teach sessions through our platform and get paid automatically after each completed session."
    }
  ];

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
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white section-container" ref={animationRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">How It Works</h2>
          <div className="w-24 h-1 bg-teal-500 mx-auto mb-6"></div>
          <p className="mt-4 text-lg text-navy-700 max-w-2xl mx-auto">
            Our platform makes it simple to connect students with coaches for effective learning experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* For Students */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-navy-800 mb-10 text-center">For Students</h3>
            <div className="space-y-12">
              {studentSteps.map((step, index) => (
                <motion.div 
                  key={`student-${index}`} 
                  className="flex items-start bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                  variants={itemVariants}
                >
                  <div className="mr-6 flex-shrink-0 bg-navy-50 p-3 rounded-full">{step.icon}</div>
                  <div>
                    <h4 className="text-xl font-semibold text-navy-800 mb-2">{step.title}</h4>
                    <p className="text-navy-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a href="#" className="inline-flex items-center text-teal-600 font-medium hover:underline transition-colors">
                Find a tutor today <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* For Coaches */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-navy-800 mb-10 text-center">For Coaches</h3>
            <div className="space-y-12">
              {coachSteps.map((step, index) => (
                <motion.div 
                  key={`coach-${index}`} 
                  className="flex items-start bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                  variants={itemVariants}
                >
                  <div className="mr-6 flex-shrink-0 bg-navy-50 p-3 rounded-full">{step.icon}</div>
                  <div>
                    <h4 className="text-xl font-semibold text-navy-800 mb-2">{step.title}</h4>
                    <p className="text-navy-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a href="#" className="inline-flex items-center text-teal-600 font-medium hover:underline transition-colors">
                Apply as a coach <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
