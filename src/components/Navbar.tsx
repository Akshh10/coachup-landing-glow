
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white py-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <a href="#" className="text-2xl font-bold text-blue-500">CoachUp</a>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex gap-8">
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-500 transition-colors">How It Works</a>
            <a href="#subjects" className="text-gray-600 hover:text-blue-500 transition-colors">Subjects</a>
            <a href="#why-us" className="text-gray-600 hover:text-blue-500 transition-colors">Why Choose Us</a>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">Find a Tutor</Button>
            <Button className="bg-blue-500 text-white hover:bg-blue-600">Apply as a Coach</Button>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={toggleMenu} className="p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-6 shadow-md absolute w-full">
          <div className="flex flex-col space-y-4">
            <a 
              href="#how-it-works" 
              className="text-gray-600 hover:text-blue-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#subjects" 
              className="text-gray-600 hover:text-blue-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Subjects
            </a>
            <a 
              href="#why-us" 
              className="text-gray-600 hover:text-blue-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Why Choose Us
            </a>
            <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50 w-full">
              Find a Tutor
            </Button>
            <Button className="bg-blue-500 text-white hover:bg-blue-600 w-full">
              Apply as a Coach
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
