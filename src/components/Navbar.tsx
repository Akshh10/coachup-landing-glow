
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white py-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-primary">CoachUp</Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex gap-8">
            <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">How It Works</a>
            <a href="#subjects" className="text-gray-600 hover:text-primary transition-colors">Subjects</a>
          </div>
          <div className="flex gap-4">
            <Link to="/signup">
              <Button className="bg-primary text-white hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                Sign Up
              </Button>
            </Link>
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
              className="text-gray-600 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#subjects" 
              className="text-gray-600 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Subjects
            </a>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
              <Button className="bg-primary text-white hover:bg-primary/90 w-full">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
