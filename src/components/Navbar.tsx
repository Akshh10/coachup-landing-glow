
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white py-5 sticky top-0 z-50 shadow-md backdrop-blur-sm bg-white/90">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <a href="#" className="text-2xl font-bold text-navy-800">
            <span className="text-navy-800">Coach</span><span className="text-teal-600">Up</span>
          </a>
        </motion.div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-8"
          >
            <a href="#how-it-works" className="text-navy-700 hover:text-teal-600 transition-colors font-medium">
              How It Works
            </a>
            <a href="#subjects" className="text-navy-700 hover:text-teal-600 transition-colors font-medium">
              Subjects
            </a>
            <a href="#why-us" className="text-navy-700 hover:text-teal-600 transition-colors font-medium">
              Why Choose Us
            </a>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-4"
          >
            <Button 
              variant="outline" 
              className="border-navy-600 text-navy-800 hover:bg-navy-50 cta-button"
            >
              Find a Tutor
            </Button>
            <Button 
              className="bg-navy-700 text-white hover:bg-navy-800 cta-button"
            >
              Apply as a Coach
            </Button>
          </motion.div>
        </div>
        
        {/* Mobile Menu Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden"
        >
          <Button variant="ghost" onClick={toggleMenu} className="p-2">
            {isMenuOpen ? <X size={24} className="text-navy-800" /> : <Menu size={24} className="text-navy-800" />}
          </Button>
        </motion.div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white py-4 px-6 shadow-md absolute w-full"
        >
          <div className="flex flex-col space-y-4">
            <a 
              href="#how-it-works" 
              className="text-navy-700 hover:text-teal-600 transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#subjects" 
              className="text-navy-700 hover:text-teal-600 transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Subjects
            </a>
            <a 
              href="#why-us" 
              className="text-navy-700 hover:text-teal-600 transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Why Choose Us
            </a>
            <Button variant="outline" className="border-navy-600 text-navy-800 hover:bg-navy-50 w-full cta-button">
              Find a Tutor
            </Button>
            <Button className="bg-navy-700 text-white hover:bg-navy-800 w-full cta-button">
              Apply as a Coach
            </Button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
