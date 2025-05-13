
import { Shield, Clock, Award } from "lucide-react";
import { useScrollAnimation } from "@/utils/scrollAnimation";
import { motion } from "framer-motion";

const WhyChooseUs = () => {
  const animationRef = useScrollAnimation();

  const reasons = [
    {
      icon: <Shield className="h-16 w-16 text-teal-600" />,
      title: "Trusted Experts",
      description: "All our coaches go through a rigorous verification process to ensure quality. We check credentials, experience, and conduct background checks."
    },
    {
      icon: <Award className="h-16 w-16 text-teal-600" />,
      title: "Verified Coaches",
      description: "Our platform features only qualified educators with proven teaching experience and subject matter expertise."
    },
    {
      icon: <Clock className="h-16 w-16 text-teal-600" />,
      title: "Flexible & Affordable",
      description: "Book sessions when it suits your schedule. Our coaches offer various price points to accommodate different budgets."
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="why-us" className="py-20 md:py-28 bg-white section-container" ref={animationRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">Why Choose Us</h2>
          <div className="w-24 h-1 bg-teal-500 mx-auto mb-6"></div>
          <p className="mt-4 text-lg text-navy-700 max-w-2xl mx-auto">
            CoachUp provides a quality learning experience with verified experts.
          </p>
        </div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {reasons.map((reason, index) => (
            <motion.div 
              key={index} 
              className="bg-navy-50 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all border border-navy-100"
              variants={itemVariants}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-white rounded-full shadow-sm">{reason.icon}</div>
                <h3 className="text-xl font-semibold text-navy-900 mb-4">{reason.title}</h3>
                <p className="text-navy-700">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
