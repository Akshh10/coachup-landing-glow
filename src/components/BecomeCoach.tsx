
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useScrollAnimation } from "@/utils/scrollAnimation";
import { motion } from "framer-motion";

const BecomeCoach = () => {
  const animationRef = useScrollAnimation();

  const benefitList = [
    "Keep 85% of what you earn",
    "Access our growing student network",
    "Use our integrated teaching tools",
    "Early access to platform features"
  ];

  return (
    <section className="py-20 md:py-28 bg-navy-800 text-white section-container" ref={animationRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center md:justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2 mb-12 md:mb-0"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Become a Founding Coach</h2>
            <div className="w-24 h-1 bg-teal-500 my-6"></div>
            <p className="text-lg text-navy-100 max-w-lg">
              Join our growing platform of educators. Set your own rates, create your schedule, and help students achieve their academic goals.
            </p>
            <ul className="mt-8 space-y-4">
              {benefitList.map((item, index) => (
                <li key={index} className="flex items-center">
                  <div className="rounded-full bg-teal-500 p-1 mr-4">
                    <Check size={16} className="text-white" />
                  </div>
                  <span className="text-navy-100">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:w-2/5"
          >
            <div className="bg-white text-navy-900 p-8 rounded-2xl shadow-2xl border border-navy-100">
              <h3 className="text-2xl font-semibold mb-4">Apply Now</h3>
              <p className="text-navy-700 mb-6">
                Limited spots available for founding coaches. Get early access and priority placement.
              </p>
              <Button className="w-full bg-teal-600 text-white hover:bg-teal-700 py-6 text-lg rounded-lg shadow-md cta-button">
                Apply as a Coach <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BecomeCoach;
