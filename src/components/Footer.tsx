
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <footer className="bg-navy-900 text-navy-200 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10"
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold text-white mb-6">CoachUp</h3>
            <p className="mb-6 text-navy-300">Connecting students with expert tutors in coding, math, and science.</p>
            <div className="flex space-x-5">
              <a href="#" className="text-navy-400 hover:text-teal-400 transition-colors p-2 bg-navy-800 rounded-full">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-navy-400 hover:text-teal-400 transition-colors p-2 bg-navy-800 rounded-full">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-navy-400 hover:text-teal-400 transition-colors p-2 bg-navy-800 rounded-full">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-navy-400 hover:text-teal-400 transition-colors p-2 bg-navy-800 rounded-full">
                <Linkedin size={18} />
              </a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold mb-6">For Students</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-navy-300 hover:text-teal-400 transition-colors">Find a Tutor</a></li>
              <li><a href="#" className="text-navy-300 hover:text-teal-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="text-navy-300 hover:text-teal-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-navy-300 hover:text-teal-400 transition-colors">FAQ</a></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold mb-6">For Coaches</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-navy-300 hover:text-teal-400 transition-colors">Apply as a Coach</a></li>
              <li><a href="#" className="text-navy-300 hover:text-teal-400 transition-colors">Coach Resources</a></li>
              <li><a href="#" className="text-navy-300 hover:text-teal-400 transition-colors">Coach FAQ</a></li>
              <li><a href="#" className="text-navy-300 hover:text-teal-400 transition-colors">Community</a></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-navy-300 hover:text-teal-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-navy-300 hover:text-teal-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-navy-300 hover:text-teal-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-navy-300 hover:text-teal-400 transition-colors">Contact</a></li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="border-t border-navy-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-navy-400">&copy; {currentYear} CoachUp. All rights reserved.</p>
          <div className="mt-6 md:mt-0 space-x-6">
            <a href="#" className="text-navy-300 hover:text-teal-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-navy-300 hover:text-teal-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
